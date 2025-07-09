import api from '../api';

// GET /users/profile
export const getProfile = async () => {
  const response = await api.get('/users/profile');
  console.log(response.data);
  return response.data;
};

// PUT /users/profile
export const updateProfile = async (data) => {
  const response = await api.put('/users/profile', data);
  return response.data;
};

// POST /users/change-password
export const changePassword = async (data) => {
  const response = await api.post('/users/change-password', data);
  return response.data;
};

// POST /users/deactivate-account
export const deactivateAccount = async () => {
  const response = await api.post('/users/deactivate-account');
  return response.data;
};

// POST /users/<user_id>/follow
export const followUser = async (userId) => {
  const response = await api.post(`/users/${userId}/follow`);
  return response.data;
};

// POST /users/<user_id>/unfollow
export const unfollowUser = async (userId) => {
  const response = await api.post(`/users/${userId}/unfollow`);
  return response.data;
};

// GET /users/<user_id>/followers
export const getFollowers = async (userId) => {
  const response = await api.get(`/users/${userId}/followers`);
  return response.data;
};

// GET /users/<user_id>/following
export const getFollowing = async (userId) => {
  const response = await api.get(`/users/${userId}/following`);
  return response.data;
};

// GET /users/<user_id>/comments
export const getUserComments = async (userId) => {
  const response = await api.get(`/users/${userId}/comments`);
  return response.data;
};

// GET /users/search
export const searchUsers = async (params) => {
  const response = await api.get('/users/search', { params });
  return response.data;
};
