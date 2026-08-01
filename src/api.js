import axios from 'axios';

const BASE_URL = 'https://ranomed-2.onrender.com/api';

const api = axios.create({
    baseURL: BASE_URL,
});

// Request interceptor for API calls
api.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Handle FormData - axios naturally sets the correct Content-Type with boundary
        // We MUST NOT set Content-Type: application/json or any other Content-Type here
        if (config.data instanceof FormData) {
            // Delete if exists, though usually it's not set yet
            if (config.headers['Content-Type']) {
                delete config.headers['Content-Type'];
            }
        } else if (config.headers && !config.headers['Content-Type']) {
            config.headers['Content-Type'] = 'application/json';
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for API calls
api.interceptors.response.use(
    (response) => {
        return response.data;
    },
    async (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        const message = error.response?.data?.error || error.response?.data?.message || error.message || 'Something went wrong';
        return Promise.reject(new Error(message));
    }
);

export default api;
