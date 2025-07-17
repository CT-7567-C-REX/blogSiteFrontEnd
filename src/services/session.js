export function accessToken() {
  return localStorage.getItem('accessToken');
}

export function refreshToken() {
  return localStorage.getItem('refreshToken');
}

export function setSession({ accessToken, refreshToken }) {
  if (accessToken) localStorage.setItem('accessToken', accessToken);
  if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
}

export function clearSession() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

export function signedIn() {
  return !!accessToken();
}

export function removeAccessToken() {
  localStorage.removeItem('accessToken');
}
