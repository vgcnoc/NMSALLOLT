import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GenieacsService {
  private readonly logger = new Logger(GenieacsService.name);
  private client: AxiosInstance;

  constructor(private prisma: PrismaService) {}

  private async getClient(): Promise<AxiosInstance> {
    if (this.client) return this.client;

    const config = await this.prisma.genieacsConfig.findFirst();
    const baseURL = config?.url || process.env.GENIEACS_URL || 'http://localhost:7557';
    const username = config?.username || process.env.GENIEACS_USERNAME || '';
    const password = config?.password || process.env.GENIEACS_PASSWORD || '';

    this.client = axios.create({
      baseURL,
      auth: username ? { username, password } : undefined,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    return this.client;
  }

  async getDevices(query?: any) {
    try {
      const client = await this.getClient();
      const response = await client.get('/devices', { params: query });
      return response.data;
    } catch (error) {
      this.handleError('getDevices', error);
    }
  }

  async getDeviceById(id: string) {
    try {
      const client = await this.getClient();
      // Using query filter for exact ID match. The ID in GenieACS is usually a URL-encoded string or queried.
      const response = await client.get(`/devices/?query={"_id":"${id}"}`);
      return response.data[0] || null;
    } catch (error) {
      this.handleError('getDeviceById', error);
    }
  }

  async refreshDevice(id: string) {
    try {
      const client = await this.getClient();
      const response = await client.post(`/tasks`, {
        name: 'refreshObject',
        objectName: '',
        device: id
      });
      return response.data;
    } catch (error) {
      this.handleError('refreshDevice', error);
    }
  }

  async rebootDevice(id: string) {
    try {
      const client = await this.getClient();
      const response = await client.post(`/tasks`, {
        name: 'reboot',
        device: id
      });
      return response.data;
    } catch (error) {
      this.handleError('rebootDevice', error);
    }
  }

  async factoryResetDevice(id: string) {
    try {
      const client = await this.getClient();
      const response = await client.post(`/tasks`, {
        name: 'factoryReset',
        device: id
      });
      return response.data;
    } catch (error) {
      this.handleError('factoryResetDevice', error);
    }
  }

  async getParameterValues(id: string, params: string[]) {
    try {
      const client = await this.getClient();
      const projection = params.join(',');
      const response = await client.get(`/devices/?query={"_id":"${id}"}&projection=${projection}`);
      return response.data[0] || null;
    } catch (error) {
      this.handleError('getParameterValues', error);
    }
  }

  async setParameterValues(id: string, params: Record<string, any>) {
    try {
      const client = await this.getClient();
      const parameterValues = Object.entries(params).map(([name, value]) => [name, value, 'xsd:string']);
      const response = await client.post(`/tasks`, {
        name: 'setParameterValues',
        parameterValues,
        device: id
      });
      return response.data;
    } catch (error) {
      this.handleError('setParameterValues', error);
    }
  }

  private handleError(operation: string, error: any) {
    this.logger.error(`Error in ${operation}: ${error.message}`);
    throw new HttpException(
      `GenieACS error during ${operation}: ${error.response?.data?.message || error.message}`,
      error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
