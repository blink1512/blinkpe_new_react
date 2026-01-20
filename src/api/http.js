import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 20000
});

api.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);

        if (user?.apiKey && user?.apiSecret) {
          config.headers.Authorization = `token ${user.apiKey}:${user.apiSecret}`;
        }
      } catch (e) {
        console.error('Invalid user data in localStorage');
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    return {
      success: true,
      status: response.status,
      data: response.data,
      message: response.data?.message || 'Success'
    };
  },
  (error) => {
    let errorResponse = {
      success: false,
      status: 0,
      message: 'Something went wrong'
    };

    if (error.response) {
      errorResponse.status = error.response.status;
      errorResponse.message =
        error.response.data?.message ||
        error.response.data?.error ||
        'Request failed';
      errorResponse.data = error.response.data;
    } else if (error.request) {
      errorResponse.message = 'Server not responding';
    } else {
      errorResponse.message = error.message;
    }

    return Promise.reject(errorResponse);
  }
);

export const apiGet = (url, params = {}) =>
  api.get(url, { params });

export const apiPost = (url, data = {}) =>
  api.post(url, data);

export default api;
