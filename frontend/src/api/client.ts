import axios from 'axios';
import { API_BASE_URL } from '@/lib/constants';

export const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const { state } = JSON.parse(authStorage);
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    }
  } catch (err) {
    // ignore
  }
  return config;
});

export const apiClient = api;