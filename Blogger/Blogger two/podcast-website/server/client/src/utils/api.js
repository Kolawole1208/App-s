import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/update', userData),
};

export const podcastAPI = {
  getAll: (params) => api.get('/podcasts', { params }),
  getById: (id) => api.get(`/podcasts/${id}`),
  create: (podcastData) => {
    const formData = new FormData();
    Object.keys(podcastData).forEach((key) => {
      if (key === 'audio' && podcastData[key]) {
        formData.append('audio', podcastData[key]);
      } else if (podcastData[key] !== undefined) {
        formData.append(key, podcastData[key]);
      }
    });
    return api.post('/podcasts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  update: (id, podcastData) => api.put(`/podcasts/${id}`, podcastData),
  delete: (id) => api.delete(`/podcasts/${id}`),
  like: (id) => api.put(`/podcasts/${id}/like`),
};

export const commentAPI = {
  getByPodcast: (podcastId) => api.get(`/comments/podcast/${podcastId}`),
  create: (commentData) => api.post('/comments', commentData),
  update: (id, content) => api.put(`/comments/${id}`, { content }),
  delete: (id) => api.delete(`/comments/${id}`),
  like: (id) => api.put(`/comments/${id}/like`),
};

export default api;