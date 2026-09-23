export enum DeviceType {
  OLT = 'OLT',
  MIKROTIK = 'MIKROTIK',
  ROUTER = 'ROUTER',
  SWITCH = 'SWITCH',
  ONU = 'ONU',
  ACCESS_POINT = 'ACCESS_POINT'
}

export enum DeviceStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  WARNING = 'WARNING',
  MAINTENANCE = 'MAINTENANCE',
  UNKNOWN = 'UNKNOWN'
}

export enum DeviceVendor {
  ZTE = 'ZTE',
  HUAWEI = 'HUAWEI',
  CDATA = 'CDATA',
  HSGQ = 'HSGQ',
  HISFOCUS = 'HISFOCUS',
  VSOL = 'VSOL',
  MIKROTIK = 'MIKROTIK',
  OTHER = 'OTHER'
}

export enum Protocol {
  SNMP_V2C = 'SNMP_V2C',
  SNMP_V3 = 'SNMP_V3',
  SSH = 'SSH',
  TELNET = 'TELNET',
  HTTP_API = 'HTTP_API',
  HTTPS_API = 'HTTPS_API',
  MIKROTIK_API = 'MIKROTIK_API',
  MIKROTIK_API_SSL = 'MIKROTIK_API_SSL'
}

export enum AlarmSeverity {
  CRITICAL = 'CRITICAL',
  MAJOR = 'MAJOR',
  WARNING = 'WARNING',
  INFO = 'INFO'
}

export enum AlarmStatus {
  NEW = 'NEW',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  RESOLVED = 'RESOLVED'
}

export enum OnuStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  LOS = 'LOS',
  DYING_GASP = 'DYING_GASP',
  UNKNOWN = 'UNKNOWN'
}

export enum NetworkNodeType {
  POP = 'POP',
  ODC = 'ODC',
  ODP = 'ODP',
  TOWER = 'TOWER',
  SPLITTER = 'SPLITTER',
  MANHOLE = 'MANHOLE',
  POLE = 'POLE'
}

export interface DeviceCredential {
  id: string;
  deviceId: string;
  protocol: Protocol;
  username?: string;
  password?: string;
  community?: string;
  port: number;
}

export interface Device {
  id: string;
  name: string;
  ipAddress: string;
  macAddress?: string;
  type: DeviceType;
  vendor: DeviceVendor;
  model?: string;
  firmwareVersion?: string;
  status: DeviceStatus;
  uptime?: number;
  lastSeen?: Date;
  credentials?: DeviceCredential[];
  location?: { lat: number; lng: number };
}

export interface OLT extends Device {
  ponPortsCount: number;
  uplinkPortsCount: number;
}

export interface OLTBoard {
  id: string;
  oltId: string;
  slot: number;
  type: string;
  status: string;
  hardwareVersion: string;
  softwareVersion: string;
}

export interface PonPort {
  id: string;
  oltId: string;
  boardId: string;
  portIndex: number;
  status: string;
  rxPower: number;
  txPower: number;
  temperature: number;
  voltage: number;
  biasCurrent: number;
}

export interface ONUMetrics {
  rxPower: number;
  txPower: number;
  temperature: number;
  voltage: number;
  biasCurrent: number;
  cpuUsage?: number;
  memoryUsage?: number;
}

export interface OpticalPower {
  rx: number;
  tx: number;
}

export interface ONU extends Omit<Device, 'status'> {
  oltId: string;
  ponPortId: string;
  sn: string;
  status: OnuStatus;
  distance?: number;
  metrics?: ONUMetrics;
  opticalPower?: OpticalPower;
}

export interface MikroTik extends Device {
  cpuArchitecture: string;
  boardName: string;
  routerOsVersion: string;
}

export interface Alarm {
  id: string;
  deviceId: string;
  severity: AlarmSeverity;
  status: AlarmStatus;
  message: string;
  createdAt: Date;
  resolvedAt?: Date;
}

export interface POP {
  id: string;
  name: string;
  location: { lat: number; lng: number };
}

export interface NetworkNode {
  id: string;
  type: NetworkNodeType;
  name: string;
  location: { lat: number; lng: number };
}

export interface FiberRoute {
  id: string;
  name: string;
  nodes: NetworkNode[];
}

export interface NetworkLink {
  id: string;
  sourceId: string;
  targetId: string;
  type: string;
  status: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}
