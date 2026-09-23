import { api } from './client';
import type { ONU, OpticalPower, PaginatedResponse } from '@/types';

export const onusApi = {
  getAll: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<ONU>>('/onus', { params }),
  getById: (id: string) =>
    api.get<ONU>(`/onus/${id}`),
  getOpticalPower: (id: string) =>
    api.get<OpticalPower>(`/onus/${id}/optical-power`),
  reboot: (id: string) =>
    api.post(`/onus/${id}/reboot`),
};
