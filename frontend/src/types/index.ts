// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Enums as string unions
export type DeviceType = 'OLT' | 'MIKROTIK' | 'ROUTER' | 'SWITCH' | 'ACCESS_POINT';
export type DeviceStatus = 'ONLINE' | 'OFFLINE' | 'WARNING' | 'MAINTENANCE' | 'UNKNOWN';
export type DeviceVendor = 'ZTE' | 'HUAWEI' | 'CDATA' | 'HSGQ' | 'HISFOCUS' | 'VSOL' | 'MIKROTIK' | 'OTHER';
export type AlarmSeverity = 'CRITICAL' | 'MAJOR' | 'WARNING' | 'INFO';
export type AlarmStatus = 'NEW' | 'ACKNOWLEDGED' | 'RESOLVED';
export type OnuStatus = 'ONLINE' | 'OFFLINE' | 'LOS' | 'DYING_GASP' | 'UNKNOWN';

// Device
export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  vendor: string;
  model: string;
  ipAddress: string;
  managementIp?: string;
  port?: number;
  serialNumber?: string;
  firmwareVersion?: string;
  status: DeviceStatus;
  popId?: string;
  pop?: Pop;
  latitude?: number;
  longitude?: number;
  description?: string;
  metadata?: Record<string, any>;
  lastSeen?: string;
  createdAt: string;
  updatedAt: string;
}

// POP
export interface Pop {
  id: string;
  name: string;
  code: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  region?: string;
  description?: string;
  isActive: boolean;
  _count?: { devices: number };
}

// OLT
export interface OLT {
  id: string;
  deviceId: string;
  device: Device;
  oltType?: string;
  totalPonPorts?: number;
  totalBoards?: number;
  softwareVersion?: string;
  hardwareVersion?: string;
}

export interface OltBoard {
  id: string;
  oltId: string;
  slot: number;
  boardType?: string;
  status?: string;
  serialNumber?: string;
}

export interface PonPort {
  id: string;
  oltId: string;
  slot: number;
  port: number;
  name?: string;
  status?: string;
  totalOnus: number;
  onlineOnus: number;
  ponType?: string;
}

export interface ONU {
  id: string;
  oltId: string;
  ponPortId: string;
  onuId: number;
  serialNumber?: string;
  loid?: string;
  vendor?: string;
  model?: string;
  firmware?: string;
  status: OnuStatus;
  macAddress?: string;
  ipAddress?: string;
  vlan?: number;
  description?: string;
  rxPower?: number;
  txPower?: number;
  temperature?: number;
  distance?: number;
  oltRxPower?: number;
  lastOnline?: string;
  lastOffline?: string;
  uptimeSeconds?: number;
}

export interface OpticalPower {
  rx: number;
  tx: number;
  oltRx?: number;
  temperature?: number;
}

// MikroTik
export interface MikroTik {
  id: string;
  deviceId: string;
  device: Device;
  routerosVersion?: string;
  boardName?: string;
  architecture?: string;
  apiProtocol: string;
  apiPort: number;
}

// Alarm
export interface Alarm {
  id: string;
  deviceId: string;
  device?: Device;
  severity: AlarmSeverity;
  alarmType: string;
  message: string;
  status: AlarmStatus;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  createdAt: string;
}

// Dashboard
export interface DashboardOverview {
  totalOlts: number;
  onlineOlts: number;
  offlineOlts: number;
  totalOnts: number;
  onlineOnts: number;
  offlineOnts: number;
  losOnts: number;
  totalMikrotiks: number;
  onlineMikrotiks: number;
  offlineMikrotiks: number;
  totalPops: number;
  activeAlarms: { critical: number; major: number; warning: number; info: number };
  recentAlarms: Alarm[];
}

// User
export interface User {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  lastLogin?: string;
  roles: { id: string; name: string }[];
  permissions?: string[];
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: { id: string; code: string; name: string }[];
}

// Network
export interface NetworkNode {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  address?: string;
  status: string;
  popId?: string;
}

// Search
export interface SearchResult {
  type: 'device' | 'onu' | 'pop';
  id: string;
  title: string;
  subtitle: string;
  status?: string;
  url: string;
}

// Create/Update DTOs
export interface CreateDeviceDto {
  name: string;
  type: DeviceType;
  vendor: string;
  model?: string;
  ipAddress: string;
  managementIp?: string;
  port?: number;
  serialNumber?: string;
  description?: string;
  popId?: string;
  latitude?: number;
  longitude?: number;
  // Credentials
  protocol?: string;
  snmpVersion?: string;
  snmpCommunity?: string;
  sshUsername?: string;
  sshPassword?: string;
  sshPort?: number;
  apiUsername?: string;
  apiPassword?: string;
  apiPort?: number;
  apiUseSsl?: boolean;
}

export interface CreatePopDto {
  name: string;
  code: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  region?: string;
  description?: string;
}
