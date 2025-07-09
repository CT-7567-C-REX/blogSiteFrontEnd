import api from '../api';

// GET /blogPosts/jwtTestNeedToLogInFirst
export const jwtTestNeedToLogInFirst = async () => {
  console.log('hey');
  const response = await api.get('/blogPosts/jwtTestNeedToLogInFirst');
  return response.data;
};

// GET /blogPosts/allPosts
export const allPosts = async () => {
  const response = await api.get('/blogPosts/allPosts');
  return response.data;
};

// POST /blogPosts/createPost
export const createPost = async ({
  title,
  content,
  slug,
  meta_description,
  keywords,
  featured_image_url,
  featured_image_alt_text
}) => {
  const response = await api.post('/blogPosts/createPost', {
    title,
    content,
    slug,
    meta_description,
    keywords,
    featured_image_url,
    featured_image_alt_text
  });
  return response.data;
};
