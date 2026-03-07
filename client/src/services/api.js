import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:4000/api', // Adjust if your backend port is different
    withCredentials: true, // Needed for cookies if used
});

// Request Interceptor: Attach token if available (though backend uses cookies, this is good practice)
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response Interceptor: Handle global errors
API.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle token expiration or unauthorized access
        if (error.response?.status === 401) {
            // Clear expired session data
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Redirect to login if not already there
            if (window.location.pathname !== '/auth/login' && window.location.pathname !== '/') {
                window.location.href = '/auth/login?sessionExpired=true';
            }
        }
        return Promise.reject(error);
    }
);

export const logout = async () => {
    try {
        await API.get('/auth/logout');
    } catch (err) {
        console.error('Logout API failed:', err);
    } finally {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
    }
};

export default API;
