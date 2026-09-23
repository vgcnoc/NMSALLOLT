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

api.interceptors.response.use((response) => {
  // Unwrap the global backend response format: { success: true, data: ... }
  if (response.data && response.data.success !== undefined && response.data.data !== undefined) {
    response.data = response.data.data;
  }
  return response;
});

export const apiClient = api;