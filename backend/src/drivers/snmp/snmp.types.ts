export interface SnmpOptions {
  version?: 'v2c' | 'v3';
  timeout?: number;
  retries?: number;
  port?: number;
}
export interface SnmpV3SecurityParams {
  user: string;
  level: string;
  authProtocol: string;
  authKey: string;
  privProtocol: string;
  privKey: string;
}
export interface SnmpVarbind {
  oid: string;
  type: number;
  value: any;
}
export interface SnmpResult {
  varbinds: SnmpVarbind[];
}
