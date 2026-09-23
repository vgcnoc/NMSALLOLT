import { api } from './client';
import type { DashboardOverview } from '@/types';

export const dashboardApi = {
  getOverview: (params?: Record<string, any>) =>
    api.get<DashboardOverview>('/dashboard/overview', { params }),
  getOntStatusChart: (params?: Record<string, any>) =>
    api.get<any>('/dashboard/charts/ont-status', { params }),
  getTrafficChart: (params?: Record<string, any>) =>
    api.get<any>('/dashboard/charts/traffic', { params }),
  getAlarmChart: (params?: Record<string, any>) =>
    api.get<any>('/dashboard/charts/alarms', { params }),
};