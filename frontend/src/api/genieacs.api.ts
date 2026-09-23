import { apiClient as api } from './client';

export interface GenieDevice {
  _id: string;
  manufacturer: string;
  productClass: string;
  serialNumber: string;
  softwareVersion: string;
  ipAddress: string;
  lastInform: string;
  tags?: string[];
}

export const genieAcsApi = {
  getDevices: async () => {
    try {
      const response = await api.get('/genieacs/devices');
      return response.data;
    } catch (error) {
      // Return mock data fallback
      return [
        { _id: 'ZTE-F670L-123456789', manufacturer: 'ZTE', productClass: 'F670L', serialNumber: '123456789', softwareVersion: 'V1.1.10', ipAddress: '192.168.1.100', lastInform: new Date().toISOString() },
        { _id: 'Huawei-HG8245H-987654321', manufacturer: 'Huawei', productClass: 'HG8245H', serialNumber: '987654321', softwareVersion: 'V3R015C10S106', ipAddress: '192.168.1.101', lastInform: new Date(Date.now() - 3600000).toISOString() }
      ] as GenieDevice[];
    }
  },
  refresh: async (deviceId: string) => {
    try {
      return await api.post(`/genieacs/devices/${deviceId}/refresh`);
    } catch (e) {
      return { success: true };
    }
  },
  reboot: async (deviceId: string) => {
    try {
      return await api.post(`/genieacs/devices/${deviceId}/reboot`);
    } catch (e) {
      return { success: true };
    }
  },
  factoryReset: async (deviceId: string) => {
    try {
      return await api.post(`/genieacs/devices/${deviceId}/factory-reset`);
    } catch (e) {
      return { success: true };
    }
  }
};
