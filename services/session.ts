export function accessToken() {
  return localStorage.getItem('access_token')
}

export function refreshToken() {
  return localStorage.getItem('refresh_token')
}

export function setSession({ accessToken, refreshToken, user }: { accessToken: string; refreshToken: string; user?: any }) {
  localStorage.setItem('access_token', accessToken)
  localStorage.setItem('refresh_token', refreshToken)
  if (user && typeof user === 'object') {
    try {
      if (user.username) localStorage.setItem('current_username', String(user.username))
      localStorage.setItem('current_user', JSON.stringify(user))
    } catch {}
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('session-changed'))
  }
}

export function clearSession() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('current_username')
  localStorage.removeItem('current_user')
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('session-changed'))
  }
}

export function currentUsername() {
  return localStorage.getItem('current_username')
}

export function currentUser() {
  const raw = localStorage.getItem('current_user')
  try {
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
