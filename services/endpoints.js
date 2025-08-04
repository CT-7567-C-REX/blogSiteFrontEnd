const API_BASE_URL = 'http://127.0.0.1:8080';

const endpoints = {
    login : `${API_BASE_URL}/auth/login`,
    logout: `${API_BASE_URL}/auth/logout`,
    register: `${API_BASE_URL}/auth/register`,
    deactivateAccount: (token) => `${API_BASE_URL}/auth/deactivate/${token}`,
}

export { endpoints, API_BASE_URL }; 