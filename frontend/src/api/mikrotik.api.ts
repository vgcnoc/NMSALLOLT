import { apiClient as api } from './client';

export interface MikrotikDevice {
  id: string;
  name: string;
  ipAddress: string;
  model: string;
  version: string;
  architecture: string;
  cpuLoad: number;
  memoryUsage: number;
  activePppoe: number;
  status: 'online' | 'offline';
  uptime: string;
}

export const mikrotikApi = {
  getAll: async () => {
    try {
      const response = await api.get('/mikrotik');
      return response.data;
    } catch (error) {
      // Return mock data fallback
      return [
        { id: '1', name: 'Core-Router-1', ipAddress: '10.0.0.1', model: 'CCR2116-12G-4S+', version: '7.12.1', architecture: 'arm64', cpuLoad: 12, memoryUsage: 45, activePppoe: 1543, status: 'online', uptime: '14d 5h 22m' },
        { id: '2', name: 'BNG-01', ipAddress: '10.0.0.2', model: 'CCR1036-8G-2S+', version: '6.49.10', architecture: 'tile', cpuLoad: 35, memoryUsage: 60, activePppoe: 2100, status: 'online', uptime: '45d 12h 1m' },
        { id: '3', name: 'Dist-01', ipAddress: '10.0.1.1', model: 'RB1100AHx4', version: '7.11.2', architecture: 'arm', cpuLoad: 5, memoryUsage: 22, activePppoe: 0, status: 'offline', uptime: '0s' }
      ] as MikrotikDevice[];
    }
  },
  getById: async (id: string) => {
    try {
      const response = await api.get(`/mikrotik/${id}`);
      return response.data;
    } catch (error) {
      return { id, name: 'Core-Router-1', ipAddress: '10.0.0.1', model: 'CCR2116-12G-4S+', version: '7.12.1', architecture: 'arm64', cpuLoad: 12, memoryUsage: 45, activePppoe: 1543, status: 'online', uptime: '14d 5h 22m' } as MikrotikDevice;
    }
  },
  getInterfaces: async (id: string) => {
    try {
      const res = await api.get(`/mikrotik/${id}/interfaces`);
      return res.data;
    } catch(e) {
      return [
        { id: '1', name: 'sfp-sfpplus1', type: 'vlan', mtu: 1500, txByte: 1000000000, rxByte: 2000000000, running: true },
        { id: '2', name: 'ether1', type: 'ether', mtu: 1500, txByte: 500000000, rxByte: 100000000, running: true }
      ];
    }
  },
  getPppoe: async (id: string) => {
    try {
      const res = await api.get(`/mikrotik/${id}/pppoe`);
      return res.data;
    } catch(e) {
      return [
        { id: '1', user: 'user1', address: '100.64.1.10', uptime: '1d 2h', callerId: '00:11:22:33:44:55' },
        { id: '2', user: 'user2', address: '100.64.1.11', uptime: '5h 10m', callerId: 'AA:BB:CC:DD:EE:FF' }
      ];
    }
  },
  getDhcp: async (id: string) => {
    try {
      const res = await api.get(`/mikrotik/${id}/dhcp`);
      return res.data;
    } catch(e) {
      return [
        { id: '1', address: '192.168.88.10', macAddress: '12:34:56:78:90:AB', hostname: 'PC-1', status: 'bound' },
        { id: '2', address: '192.168.88.11', macAddress: 'AB:CD:EF:12:34:56', hostname: 'Phone-1', status: 'bound' }
      ];
    }
  },
  getBgp: async (id: string) => {
    try {
      const res = await api.get(`/mikrotik/${id}/bgp`);
      return res.data;
    } catch(e) {
      return [
        { id: '1', name: 'peer-isp1', remoteAddress: '203.0.113.1', remoteAs: 65001, state: 'established' },
        { id: '2', name: 'peer-isp2', remoteAddress: '198.51.100.1', remoteAs: 65002, state: 'idle' }
      ];
    }
  }
};
