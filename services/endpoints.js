const API_BASE_URL = 'http://127.0.0.1:8080';

const endpoints = {
    login : `${API_BASE_URL}/auth/login`,
    logout: `${API_BASE_URL}/auth/logout`,
    register: `${API_BASE_URL}/auth/register`,
    userProfile: `${API_BASE_URL}/users/profile`,
    userProfileByUsername: (username) => `${API_BASE_URL}/users/profile/${username}`,
    userPostsByUsername: (username) => `${API_BASE_URL}/users/profile/${username}/posts`,
    updateProfilePicture: `${API_BASE_URL}/users/updateProfilePic`,
    blogPostsCreate: `${API_BASE_URL}/blogPosts/create`,
    blogPostEdit: (postId) => `${API_BASE_URL}/blogPosts/edit/${postId}`,
    blogPostDelete: (postId) => `${API_BASE_URL}/blogPosts/delete/${postId}`,
    blogPostsAll: `${API_BASE_URL}/blogPosts/allPosts`,
    blogPostBySlug: (slug) => `${API_BASE_URL}/blogPosts/slug/${slug}`,
    deactivateAccount: (token) => `${API_BASE_URL}/auth/deactivate/${token}`,
}

export { endpoints, API_BASE_URL }; 