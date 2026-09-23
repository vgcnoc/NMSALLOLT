import { Injectable } from '@nestjs/common';
import { OLTDriver, OLTSystemInfo, PonPortInfo, ONUInfo, OpticalPower, TrafficData, MemoryInfo, OLTAlarm, DeviceInterfaceInfo } from '../interfaces/olt-driver.interface';

@Injectable()
export class MockOltDriver implements OLTDriver {
  async connect(): Promise<boolean> { return true; }
  async disconnect(): Promise<void> {}
  
  async getSystemInfo(): Promise<OLTSystemInfo> {
    return {
      vendor: 'ZTE',
      model: 'C320',
      firmwareVersion: 'V2.1.0',
      uptime: 30 * 24 * 3600,
      cpuUsage: Math.floor(Math.random() * 30 + 15),
      memoryUsage: { total: 1024, used: Math.floor(Math.random() * 200 + 400), free: 0, usagePercentage: Math.floor(Math.random() * 25 + 40) },
      temperature: Math.floor(Math.random() * 20 + 35)
    };
  }

  async getBoards(): Promise<any[]> {
    return [{ slot: 1, type: 'GTGO' }, { slot: 2, type: 'GTGH' }];
  }

  async getPonPorts(): Promise<PonPortInfo[]> {
    const ports = [];
    for(let i=1; i<=8; i++) {
      ports.push({ name: `gpon-olt_1/${i}`, slot: '1', port: i.toString(), adminState: 'up', operState: 'up', onuCount: Math.floor(Math.random() * 27 + 5) });
    }
    return ports;
  }

  async getOnus(slot: number | string, port: number | string): Promise<any[]> {
    return [
      { id: 1, sn: 'ZTEG' + Math.floor(Math.random()*10000).toString(), status: 'online', mac: 'E0:67:B3:' + Math.floor(Math.random()*99).toString() + ':00:11' },
      { id: 2, sn: 'ZTEG' + Math.floor(Math.random()*10000).toString(), status: 'offline', mac: 'E0:67:B3:' + Math.floor(Math.random()*99).toString() + ':22:33' }
    ];
  }
  
  async getOnuDetail(onuId: string): Promise<any> { return {}; }
  
  async getOpticalPower(onuId: string): Promise<OpticalPower> {
    return { rxPower: - (Math.random() * 8 + 18), txPower: Math.random() * 2 + 1.5, temperature: 40, voltage: 3.3, biasCurrent: 15 };
  }
  
  async getAlarms(): Promise<OLTAlarm[]> { return []; }
  async getInterfaces(): Promise<DeviceInterfaceInfo[]> { return []; }
  async getTraffic(iface: string): Promise<TrafficData> { return { rxBytes: 1000, txBytes: 2000, rxRate: 100, txRate: 200 }; }
}
