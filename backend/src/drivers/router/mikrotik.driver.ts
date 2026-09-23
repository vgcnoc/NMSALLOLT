import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import * as https from 'https';
import { RouterDriver } from '../interfaces/router-driver.interface';

@Injectable()
export class MikrotikDriver implements RouterDriver {
  private readonly logger = new Logger(MikrotikDriver.name);
  private client: AxiosInstance;
  private connected = false;

  async connect(credentials?: any): Promise<boolean> {
    try {
      if (!credentials) {
        throw new Error('Credentials are required for Mikrotik connection');
      }

      const { ipAddress, apiUsername, apiPassword, apiPort = 443, apiUseSsl = true } = credentials;
      const protocol = apiUseSsl ? 'https' : 'http';
      const baseURL = `${protocol}://${ipAddress}:${apiPort}/rest`;

      this.client = axios.create({
        baseURL,
        auth: {
          username: apiUsername,
          password: apiPassword,
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
        timeout: 10000,
      });

      // Test connection
      await this.client.get('/system/resource');
      this.connected = true;
      this.logger.log(`Connected to Mikrotik router at ${ipAddress}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to connect to Mikrotik: ${error.message}`);
      this.connected = false;
      return false;
    }
  }

  async disconnect(): Promise<void> {
    this.client = null;
    this.connected = false;
    this.logger.log('Disconnected from Mikrotik router');
  }

  private checkConnection() {
    if (!this.connected || !this.client) {
      throw new Error('Not connected to Mikrotik router');
    }
  }

  async getSystemInfo(): Promise<any> {
    this.checkConnection();
    const resource = await this.client.get('/system/resource');
    const routerboard = await this.client.get('/system/routerboard');
    return {
      resource: resource.data,
      routerboard: routerboard.data,
    };
  }

  async getInterfaces(): Promise<any[]> {
    this.checkConnection();
    const response = await this.client.get('/interface');
    return response.data;
  }

  async getTraffic(interfaceName: string): Promise<any> {
    this.checkConnection();
    const response = await this.client.get(`/interface/monitor-traffic?interface=${interfaceName}&once`);
    return response.data[0];
  }

  async getPppoeActive(): Promise<any[]> {
    this.checkConnection();
    const response = await this.client.get('/ppp/active');
    return response.data;
  }

  async getRoutes(): Promise<any[]> {
    this.checkConnection();
    const response = await this.client.get('/ip/route');
    return response.data;
  }

  async getBgpPeers(): Promise<any[]> {
    this.checkConnection();
    const response = await this.client.get('/routing/bgp/peer');
    return response.data;
  }

  async getDhcpLeases(): Promise<any[]> {
    this.checkConnection();
    const response = await this.client.get('/ip/dhcp-server/lease');
    return response.data;
  }

  async getFirewallStats(): Promise<any> {
    this.checkConnection();
    const response = await this.client.get('/ip/firewall/filter');
    return response.data;
  }

  async getQueues(): Promise<any[]> {
    this.checkConnection();
    const response = await this.client.get('/queue/simple');
    return response.data;
  }
}
