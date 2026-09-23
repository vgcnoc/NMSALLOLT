import { Injectable, Logger } from '@nestjs/common';
import { OLTDriver } from '../interfaces/olt-driver.interface';
import { SnmpEngineService } from '../snmp/snmp-engine.service';
import { SshEngineService } from '../ssh/ssh-engine.service';

@Injectable()
export class ZteDriver implements OLTDriver {
  private readonly logger = new Logger(ZteDriver.name);
  private deviceIp: string;

  constructor(
    private readonly snmpEngine: SnmpEngineService,
    private readonly sshEngine: SshEngineService,
  ) {}

  async connect(credentials: any): Promise<void> {
    this.logger.log(`Connecting to ZTE OLT at ${credentials.ip}`);
    this.deviceIp = credentials.ip;
    
    // Connect SSH
    if (credentials.sshUsername) {
      await this.sshEngine.connect({
        host: credentials.ip,
        port: credentials.sshPort || 22,
        username: credentials.sshUsername,
        password: credentials.sshPassword,
      });
    }
    
    // Connect SNMP is generally stateless, just configuration could be set here
    // But assuming engines are ready to use
  }

  async disconnect(): Promise<void> {
    this.logger.log(`Disconnecting from ZTE OLT at ${this.deviceIp}`);
    await this.sshEngine.disconnect();
  }

  async getSystemInfo(): Promise<any> {
    try {
      const output = await this.sshEngine.executeCommand('show version');
      // Dummy regex parsing
      const uptimeMatch = output.match(/uptime is (.*)/i);
      const versionMatch = output.match(/version (.*)/i);
      return {
        vendor: 'ZTE',
        uptime: uptimeMatch ? uptimeMatch[1] : 'Unknown',
        version: versionMatch ? versionMatch[1] : 'Unknown',
      };
    } catch (error) {
      this.logger.error(`Error getting system info: ${error.message}`);
      return null;
    }
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
    try {
      const output = await this.sshEngine.executeCommand('show pon interface');
      const ports = [];
      const regex = /gpon-olt_\d+\/(\d+)\/(\d+)\s+(\S+)\s+(\S+)/gi;
      let match;
      while ((match = regex.exec(output)) !== null) {
        ports.push({ slot: match[1], port: match[2], adminState: match[3], status: match[4] });
      }
      return ports;
    } catch (error) {
      this.logger.error(`Error getting PON ports: ${error.message}`);
      return [];
    }
  }

  async getOnus(ponSlot: number, ponPort: number): Promise<any[]> {
    try {
      // Often you use "show gpon onu state gpon-olt_1/x/y" to get SN and status
      const output = await this.sshEngine.executeCommand(`show gpon onu state gpon-olt_1/${ponSlot}/${ponPort}`);
      const onus = [];
      // Example output: gpon-onu_1/1/1:1   ZTEG12345678  working
      const regex = new RegExp(`gpon-onu_\\d+\\/${ponSlot}\\/${ponPort}:(\\d+)\\s+(\\w+)\\s+(\\w+)`, 'gi');
      let match;
      while ((match = regex.exec(output)) !== null) {
        onus.push({ id: match[1], sn: match[2], status: match[3] });
      }
      return onus;
    } catch (error) {
      this.logger.error(`Error getting ONUs: ${error.message}`);
      return [];
    }
  }

  async getOpticalPower(ponSlot: number, ponPort: number, onuId: number): Promise<any> {
    try {
      const output = await this.sshEngine.executeCommand(`show pon onu optical-info gpon-onu_1/${ponSlot}/${ponPort}:${onuId}`);
      const rxMatch = output.match(/Rx optical power.*:\s*(-?\d+\.\d+)/i);
      const txMatch = output.match(/Tx optical power.*:\s*(-?\d+\.\d+)/i);
      return { 
        rx: rxMatch ? parseFloat(rxMatch[1]) : null, 
        tx: txMatch ? parseFloat(txMatch[1]) : null 
      };
    } catch (error) {
      this.logger.error(`Error getting optical power: ${error.message}`);
      return { rx: null, tx: null };
    }
  }
  
  async getOpticalPowerBulk(): Promise<any[]> {
    return [];
  }
}
