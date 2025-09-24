import axios from 'axios'
import { accessToken, refreshToken, setSession, clearSession } from './session'
import { API_BASE_URL } from './endpoints'

// ----------------------
// Utilities
// ----------------------
function parseJwt(token: string) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(json)
  } catch (e) {
    console.error('Failed to parse JWT', e)
    return null
  }
}

function isTokenExpiringSoon(token: string, thresholdSeconds = 60) {
  const decoded = parseJwt(token)
  if (!decoded || !decoded.exp) return true
  const now = Math.floor(Date.now() / 1000)
  return decoded.exp - now <= thresholdSeconds
}

// ----------------------
// Axios Instance
// ----------------------
const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ----------------------
// Interceptors
// ----------------------
let isRefreshing = false
let failedQueue: { resolve: (token: string) => void; reject: (err: any) => void }[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve(token!)
  })
  failedQueue = []
}

// Request interceptor
client.interceptors.request.use(
  async (config) => {
    const token = accessToken()
    const rToken = refreshToken()

    if (token && isTokenExpiringSoon(token) && !isRefreshing) {
      isRefreshing = true
      try {
        const refreshRes = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { access_token: token },
          { headers: { Authorization: `Bearer ${rToken}` } }
        )

        const newAccessToken = refreshRes.data.access_token
        const newRefreshToken = refreshRes.data.refresh_token

        setSession({ accessToken: newAccessToken, refreshToken: newRefreshToken })

        config.headers['Authorization'] = `Bearer ${newAccessToken}`
      } catch (err) {
        console.error('Early refresh failed', err)
        clearSession()
        window.location.href = '/login'
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    } else if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
client.interceptors.response.use(
  (response) => {
    // Optional: Save new tokens if backend returns them
    const token = response.data?.access_token
    const rToken = response.data?.refresh_token
    if (token || rToken) {
      setSession({ accessToken: token, refreshToken: rToken })
    }
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`
            return client(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      isRefreshing = true
      try {
        const refreshRes = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { access_token: accessToken() },
          { headers: { Authorization: `Bearer ${refreshToken()}` } }
        )

        const newAccessToken = refreshRes.data.access_token
        const newRefreshToken = refreshRes.data.refresh_token

        setSession({ accessToken: newAccessToken, refreshToken: newRefreshToken })

        processQueue(null, newAccessToken)

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
        return client(originalRequest)
      } catch (refreshErr) {
        processQueue(refreshErr, null)
        clearSession()
        window.location.href = '/login'
        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default client
