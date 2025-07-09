// src/services/session.js

export function signedIn() {
  return !!localStorage.getItem('accessToken');
}

export function accessToken() {
  return localStorage.getItem('accessToken');
}

export function setAccessToken(token) {
  if (token) {
    localStorage.setItem('accessToken', token);
  } else {
    localStorage.removeItem('accessToken');
  }
}

export function removeAccessToken() {
  localStorage.removeItem('accessToken');
} 