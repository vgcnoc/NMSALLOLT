import { Injectable } from '@nestjs/common';

@Injectable()
export class MockMikrotikDriver {
  async connect(): Promise<boolean> { return true; }
  async disconnect(): Promise<void> {}
  async getSystemInfo() {
    return { board: 'CCR1036-8G-2S+', version: '7.12', cpu: 25, memory: { total: 1024, used: 512, free: 512, usagePercentage: 50 }, uptime: 60*24*3600 };
  }
  async getInterfaces() { return []; }
  async getTraffic(iface: string) { return { rxBytes: 1000, txBytes: 2000, rxRate: 100, txRate: 200 }; }
}
