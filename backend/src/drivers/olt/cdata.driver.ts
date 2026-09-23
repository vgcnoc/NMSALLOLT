import { Injectable, Logger } from '@nestjs/common';
import { OLTDriver } from '../interfaces/olt-driver.interface';
import { SnmpEngineService } from '../snmp/snmp-engine.service';
import { SshEngineService } from '../ssh/ssh-engine.service';

@Injectable()
export class CdataDriver implements OLTDriver {
  private readonly logger = new Logger(CdataDriver.name);
  private deviceIp: string;

  constructor(
    private readonly snmpEngine: SnmpEngineService,
    private readonly sshEngine: SshEngineService,
  ) {}

  async connect(credentials: any): Promise<void> {
    this.logger.log(`Connecting to C-Data OLT at ${credentials.ip}`);
    this.deviceIp = credentials.ip;
    
    if (credentials.sshUsername) {
      await this.sshEngine.connect({
        host: credentials.ip,
        port: credentials.sshPort || 22,
        username: credentials.sshUsername,
        password: credentials.sshPassword,
      });
    }
  }

  async disconnect(): Promise<void> {
    this.logger.log(`Disconnecting from C-Data OLT at ${this.deviceIp}`);
    await this.sshEngine.disconnect();
  }

  async getSystemInfo(): Promise<any> {
    return {
      vendor: 'C-Data',
      uptime: 'Unknown',
      version: 'Unknown',
    };
  }
  
  async getCpu(): Promise<number> {
    return 10;
  }
  
  async getMemory(): Promise<number> {
    return 20;
  }
  
  async getTemperature(): Promise<number> {
    return 30;
  }

  async getPonPorts(): Promise<any[]> {
    return [
      { slot: 1, port: 1, status: 'up' },
    ];
  }

  async getOnus(ponSlot: number, ponPort: number): Promise<any[]> {
    return [
      { id: 1, sn: 'CDTA12345678', status: 'online' },
    ];
  }

  async getOpticalPower(ponSlot: number, ponPort: number, onuId: number): Promise<any> {
    return { rx: -20, tx: 1.5 };
  }
  
  async getOpticalPowerBulk(): Promise<any[]> {
    return [];
  }
}
