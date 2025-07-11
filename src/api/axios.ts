import axios from 'axios';

// Create a custom axios instance with default configuration
const api = axios.create({
  baseURL: '/api', // This will be proxied to http://localhost:5000/api by Vite
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token for authenticated requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors here
    if (error.response) {
      // Server responded with an error status code
      console.error('Response error:', error.response.status, error.response.data);
      
      // Handle authentication errors
      if (error.response.status === 401) {
        // Redirect to login page if unauthorized
        localStorage.removeItem('adminToken');
        window.location.href = '/admin';
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Request error:', error.request);
    } else {
      // Something else caused the error
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;