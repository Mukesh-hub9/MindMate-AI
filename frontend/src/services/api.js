import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API = axios.create({ baseURL: `${API_URL}/api` });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('mindmate_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('mindmate_token');
      localStorage.removeItem('mindmate_user');
      if (window.location.pathname !== '/auth') window.location.assign('/auth');
    }
    return Promise.reject(error);
  }
);

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/profile');

// Mood
export const saveMood = (data) => API.post('/mood', data);
export const getMoods = () => API.get('/mood');
export const getLatestMood = () => API.get('/mood/latest');
export const getRecommendations = () => API.get('/mood/recommendations');

// Chat
export const sendMessage = (data) => API.post('/chat', data);
export const getChatHistory = () => API.get('/chat/history');
export const clearChat = () => API.delete('/chat/clear');

// Journal
export const createJournal = (data) => API.post('/journal', data);
export const getJournals = () => API.get('/journal');
export const deleteJournal = (id) => API.delete(`/journal/${id}`);

export default API;
