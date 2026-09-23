export interface RouterDriver {
  connect(credentials?: any): Promise<boolean>;
  disconnect(): Promise<void>;
  getSystemInfo(): Promise<any>;
  getInterfaces(): Promise<any[]>;
  getTraffic(interfaceName: string): Promise<any>;
  getPppoeActive(): Promise<any[]>;
  getRoutes(): Promise<any[]>;
  getBgpPeers(): Promise<any[]>;
  getDhcpLeases(): Promise<any[]>;
  getFirewallStats(): Promise<any>;
  getQueues(): Promise<any[]>;
}
