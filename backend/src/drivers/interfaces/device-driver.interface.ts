export interface DeviceDriver {
  connect(): Promise<boolean>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  getSystemInfo(): Promise<any>;
  getInterfaces(): Promise<any[]>;
  getMetrics(): Promise<any>;
}
