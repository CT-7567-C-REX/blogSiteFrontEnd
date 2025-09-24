import client from '../axios'
import { endpoints } from '../endpoints'
import { setSession, clearSession } from '../session'

/**
 * Login user with emailOrUsername and password
 * @param {string} emailOrUsername
 * @param {string} password
 * @returns {Promise<any>} server response data
 */
export async function login(emailOrUsername, password) {
  const res = await client.post(endpoints.login, {
    emailOrUsername,
    password,
  })
  const data = res.data
  const { access_token, refresh_token, user } = data || {}
  if (access_token && refresh_token) {
    setSession({ accessToken: access_token, refreshToken: refresh_token, user })
  }
  return Boolean(access_token && refresh_token)
}

/**
 * Register a new user
* @param {string} fullName 
* @param {string} username
 * @param {string} email
 * @param {string} password
 * @param {string} passwordAgain
 * @returns {Promise<any>} server response data
 */
export async function register( fullName, username, email, password, passwordAgain) {
  const res = await client.post(endpoints.register, {
    fullName,
    username,
    email,
    password,
    passwordAgain,
  })
  const data = res.data
  const { access_token, refresh_token, user } = data || {}
  if (access_token && refresh_token) {
    setSession({ accessToken: access_token, refreshToken: refresh_token, user })
  }
  return Boolean(access_token && refresh_token)
}

/**
 * Logout current user
 * Uses Authorization header from axios client interceptor
 * @returns {Promise<any>} server response data
 */
export async function logout() {
  try {
    const res = await client.post(endpoints.logout)
    return res.data
  } finally {
    // Ensure local logout even if the request fails
    clearSession()
  }
}

export default { login, register, logout }


