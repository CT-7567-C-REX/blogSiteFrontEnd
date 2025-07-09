import axios from 'axios';
import { accessToken, setAccessToken } from './session';
import { API_BASE_URL } from '../config';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken()}`
  },
});

// Add a response interceptor to store access token if present in response
api.interceptors.response.use(
  (response) => {
    const token = response.data?.accessToken || response.data?.token || response.data?.access_token;
    if (token) {
      setAccessToken(token);
    }
    return response;
  },
  (error) => Promise.reject(error)
);

export default api;

