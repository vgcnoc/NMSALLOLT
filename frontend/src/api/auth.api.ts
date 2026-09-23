import { apiClient } from './client';
export const authApi = {
  login: (data: any) => apiClient.post('/auth/login', data)
};