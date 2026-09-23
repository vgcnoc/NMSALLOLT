import { api } from './client';
import type { Device, PaginatedResponse, CreateDeviceDto } from '@/types';

export const devicesApi = {
  getAll: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<Device>>('/devices', { params }),
  getById: (id: string) =>
    api.get<Device>(`/devices/${id}`),
  create: (data: CreateDeviceDto) =>
    api.post<Device>('/devices', data),
  update: (id: string, data: Partial<CreateDeviceDto>) =>
    api.put<Device>(`/devices/${id}`, data),
  delete: (id: string) =>
    api.delete(`/devices/${id}`),
  poll: (id: string) =>
    api.post(`/devices/${id}/poll`),
};