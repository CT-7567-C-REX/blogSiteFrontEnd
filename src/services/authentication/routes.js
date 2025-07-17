import api from '../api';
import { refreshToken, } from '../session';

// Register a new user
export const register = async ({ username, fullName, email, password, passwordAgain }) => {
  const response = await api.post('/auth/register', {
    username,
    fullName,
    email,
    password,
    passwordAgain,
  });
  return response.data;
};

// Login user
export const login = async ({ emailOrUsername, password }) => {
  const response = await api.post('/auth/login', {
    emailOrUsername,
    password,
  });
  return response.data;
};

// Logout user
export const logout = async () => {
  const response = await api.post('/auth/logout', {
    refresh_token: refreshToken(),
  });
  return response.data;
};

