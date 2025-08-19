export function accessToken() {
  return localStorage.getItem('access_token')
}

export function refreshToken() {
  return localStorage.getItem('refresh_token')
}

export function setSession({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) {
  localStorage.setItem('access_token', accessToken)
  localStorage.setItem('refresh_token', refreshToken)
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('session-changed'))
  }
}

export function clearSession() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('session-changed'))
  }
}
