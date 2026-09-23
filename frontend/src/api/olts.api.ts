import { api } from './client';
import type { OLT, OltBoard, PonPort, ONU, Alarm, PaginatedResponse } from '@/types';

export const oltsApi = {
  getAll: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<OLT>>('/olts', { params }),
  getById: (id: string) =>
    api.get<OLT>(`/olts/${id}`),
  getBoards: (id: string) =>
    api.get<OltBoard[]>(`/olts/${id}/boards`),
  getPonPorts: (id: string) =>
    api.get<PonPort[]>(`/olts/${id}/pon-ports`),
  getOnus: (id: string, params?: Record<string, any>) =>
    api.get<PaginatedResponse<ONU>>(`/olts/${id}/onus`, { params }),
  getAlarms: (id: string, params?: Record<string, any>) =>
    api.get<PaginatedResponse<Alarm>>(`/olts/${id}/alarms`, { params }),
  poll: (id: string) =>
    api.post(`/olts/${id}/poll`),
};
