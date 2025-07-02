import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createPost = (data) => api.post('/api/createPost', data);
export const signUp = (data) => api.post('/api/signup', data);
export const signIn = (data) => api.post('/api/signin', data);
export const allPosts = () => api.get('/api/allPosts'); 