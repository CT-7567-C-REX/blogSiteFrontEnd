import axios from "axios";
import { accessToken, refreshToken, setSession, clearSession } from "./session";
import { API_BASE_URL } from "../config";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

function parseJwt(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(json);
  } catch (e) {
    console.error("Failed to parse JWT", e);
    return null;
  }
}

function isTokenExpiringSoon(token, thresholdSeconds = 60) {
  const decoded = parseJwt(token);
  if (!decoded || !decoded.exp) return true; // treat invalid as expired
  const now = Math.floor(Date.now() / 1000);
  return decoded.exp - now <= thresholdSeconds;
}

api.interceptors.request.use(
  async config => {
    const token = accessToken();
    const rToken = refreshToken();

    if (token && isTokenExpiringSoon(token) && !isRefreshing) {
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          access_token: token
        }, {
          headers: {
            Authorization: `Bearer ${rToken}`
          }
        });

        const newAccessToken = refreshResponse.data.access_token;
        const newRefreshToken = refreshResponse.data.refresh_token;

        setSession({ accessToken: newAccessToken, refreshToken: newRefreshToken });
        config.headers['Authorization'] = `Bearer ${newAccessToken}`;
      } catch (err) {
        console.error("Early refresh failed", err);
        clearSession();
        window.location.href = '/signin';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    } else if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error)
);

// Refresh logic on 401 error
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    // Store new access token if returned
    const token = response.data?.accessToken || response.data?.token || response.data?.access_token;
    const rToken = response.data?.refreshToken || response.data?.refresh_token;
    if (token || rToken) {
      setSession({ accessToken: token, refreshToken: rToken });
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => { failedQueue.push({ resolve, reject });}).then((token) => {

            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            
            return api(originalRequest);

          }).catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`,
          { access_token: accessToken() }, // body
          { headers: { Authorization: `Bearer ${refreshToken()}` } }// header
        );

        const newAccessToken = refreshResponse.data.access_token;
        const newRefreshToken = refreshResponse.data.refresh_token;

        setSession({ accessToken: newAccessToken, refreshToken: newRefreshToken });

        api.defaults.headers.common[ "Authorization"] = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        clearSession();
        window.location.href = "/signin"; // or show a toast
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
