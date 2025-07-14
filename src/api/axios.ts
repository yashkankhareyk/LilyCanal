import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});



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


api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {

    if (error.response) {

      console.error('Response error:', error.response.status, error.response.data);

      if (error.response.status === 401) {

        localStorage.removeItem('adminToken');
        window.location.href = '/admin';
      }
    } else if (error.request) {

      console.error('Request error:', error.request);
    } else {

      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;