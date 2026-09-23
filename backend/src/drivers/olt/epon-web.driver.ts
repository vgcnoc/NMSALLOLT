import { Injectable, Logger } from '@nestjs/common';
import { OLTDriver } from '../interfaces/olt-driver.interface';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class EponWebDriver implements OLTDriver {
  private readonly logger = new Logger(EponWebDriver.name);
  private client: AxiosInstance;
  private deviceIp: string;

  async connect(credentials: any): Promise<void> {
    this.logger.log(`Connecting to EPON Web OLT at ${credentials.ip}`);
    this.deviceIp = credentials.ip;
    
    // Most EPON Web OLTs (GoAhead) use HTTP Basic Auth
    this.client = axios.create({
      baseURL: `http://${credentials.ip}${credentials.sshPort ? ':' + credentials.sshPort : ''}`,
      timeout: 10000,
      auth: {
        username: credentials.sshUsername || 'admin',
        password: credentials.sshPassword || 'admin',
      },
    });

    // Test connection
    try {
      await this.client.get('/');
      this.logger.log('Connected to EPON Web OLT successfully.');
    } catch (e) {
      this.logger.error(`Failed to connect to EPON Web OLT: ${e.message}`);
      throw new Error(`Failed to connect to Web UI: ${e.message}`);
    }
  }

  async disconnect(): Promise<void> {
    this.logger.log(`Disconnecting from EPON Web OLT at ${this.deviceIp}`);
    // No-op for stateless HTTP
  }

  async getSystemInfo(): Promise<any> {
    return {
      vendor: 'EPON-Web',
      uptime: 'Unknown',
      version: 'Unknown',
    };
  }
  
  async getCpu(): Promise<number> { return 10; }
  async getMemory(): Promise<number> { return 20; }
  async getTemperature(): Promise<number> { return 30; }

  async getPonPorts(): Promise<any[]> {
    // Return dummy 4 PON ports since we don't have the exact board info endpoint yet.
    return [
      { slot: 1, port: 1, status: 'up' },
      { slot: 1, port: 2, status: 'up' },
      { slot: 1, port: 3, status: 'up' },
      { slot: 1, port: 4, status: 'up' },
    ];
  }

  async getOnus(ponSlot: number, ponPort: number): Promise<any[]> {
    try {
      // Placeholder: Some OLTs use /goform/OnuMacList or /cgi-bin/onu_list.cgi
      const response = await this.client.get('/'); 
      const html = response.data;
      
      this.logger.debug(`Fetched ONU HTML from port ${ponPort}`);

      // Basic naive parsing for demo purposes. 
      // Replace with actual regex once we have the HTML structure.
      const onus = [];
      const regex = /([0-9a-fA-F]{2}:[0-9a-fA-F]{2}:[0-9a-fA-F]{2}:[0-9a-fA-F]{2}:[0-9a-fA-F]{2}:[0-9a-fA-F]{2})/g;
      
      let match;
      let id = 1;
      while ((match = regex.exec(html)) !== null) {
        onus.push({
          id: id++,
          sn: 'EPON' + id,
          status: 'online',
          mac: match[1] // Found MAC address in the HTML
        });
      }

      return onus;
    } catch (error) {
      this.logger.error(`Error getting ONUs via Web: ${error.message}`);
      return [];
    }
  }

  async getOpticalPower(ponSlot: number, ponPort: number, onuId: number): Promise<any> {
    // Placeholder for Optical Power endpoint
    // Usually retrieved via AJAX like /goform/get_onu_info?port=1&onu=1
    return { rx: -20, tx: 2 };
  }
  
  async getOpticalPowerBulk(): Promise<any[]> {
    return [];
  }
}
