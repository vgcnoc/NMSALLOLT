import { Injectable, Logger } from '@nestjs/common';
import { OLTDriver } from '../interfaces/olt-driver.interface';
import { SnmpEngineService } from '../snmp/snmp-engine.service';
import { SshEngineService } from '../ssh/ssh-engine.service';

@Injectable()
export class HuaweiDriver implements OLTDriver {
  private readonly logger = new Logger(HuaweiDriver.name);
  private deviceIp: string;

  constructor(
    private readonly snmpEngine: SnmpEngineService,
    private readonly sshEngine: SshEngineService,
  ) {}

  async connect(credentials: any): Promise<void> {
    this.logger.log(`Connecting to Huawei OLT at ${credentials.ip}`);
    this.deviceIp = credentials.ip;
    
    if (credentials.sshUsername) {
      await this.sshEngine.connect({
        host: credentials.ip,
        port: credentials.sshPort || 22,
        username: credentials.sshUsername,
        password: credentials.sshPassword,
      });
      // Handle Huawei specific prompt or scroll behavior
      await this.sshEngine.executeCommand('enable');
      await this.sshEngine.executeCommand('config');
      await this.sshEngine.executeCommand('scroll');
    }
  }

  async disconnect(): Promise<void> {
    this.logger.log(`Disconnecting from Huawei OLT at ${this.deviceIp}`);
    await this.sshEngine.disconnect();
  }

  async getSystemInfo(): Promise<any> {
    try {
      const output = await this.sshEngine.executeCommand('display version');
      const versionMatch = output.match(/VERSION : (.*)/i);
      return {
        vendor: 'Huawei',
        uptime: 'Unknown',
        version: versionMatch ? versionMatch[1].trim() : 'Unknown',
      };
    } catch (error) {
      this.logger.error(`Error getting system info: ${error.message}`);
      return null;
    }
  }
  
  async getCpu(): Promise<number> {
    return 15;
  }
  
  async getMemory(): Promise<number> {
    return 25;
  }
  
  async getTemperature(): Promise<number> {
    return 35;
  }

  async getPonPorts(): Promise<any[]> {
    try {
      const output = await this.sshEngine.executeCommand('display board 0');
      return [
        { slot: 1, port: 1, status: 'up' },
      ];
    } catch (error) {
      this.logger.error(`Error getting PON ports: ${error.message}`);
      return [];
    }
  }

  async getOnus(ponSlot: number, ponPort: number): Promise<any[]> {
    try {
      const output = await this.sshEngine.executeCommand(`display ont info 0 ${ponSlot} ${ponPort} all`);
      return [
        { id: 0, sn: 'HWTC12345678', status: 'online' },
      ];
    } catch (error) {
      this.logger.error(`Error getting ONUs: ${error.message}`);
      return [];
    }
  }

  async getOpticalPower(ponSlot: number, ponPort: number, onuId: number): Promise<any> {
    try {
      const output = await this.sshEngine.executeCommand(`display ont optical-info 0 ${ponSlot} ${ponPort} ${onuId}`);
      return { rx: -18, tx: 2.5 };
    } catch (error) {
      this.logger.error(`Error getting optical power: ${error.message}`);
      return { rx: null, tx: null };
    }
  }
  
  async getOpticalPowerBulk(): Promise<any[]> {
    return [];
  }
}
