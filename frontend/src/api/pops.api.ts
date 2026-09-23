import { api } from './client';
import type { Pop, Device, PaginatedResponse, CreatePopDto } from '@/types';

export const popsApi = {
  getAll: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<Pop>>('/pops', { params }),
  getById: (id: string) =>
    api.get<Pop>(`/pops/${id}`),
  create: (data: CreatePopDto) =>
    api.post<Pop>('/pops', data),
  update: (id: string, data: Partial<CreatePopDto>) =>
    api.put<Pop>(`/pops/${id}`, data),
  delete: (id: string) =>
    api.delete(`/pops/${id}`),
  getDevices: (id: string, params?: Record<string, any>) =>
    api.get<PaginatedResponse<Device>>(`/pops/${id}/devices`, { params }),
};
