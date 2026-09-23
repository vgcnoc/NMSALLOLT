export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  NOC = 'NOC',
  NETWORK_ENGINEER = 'NETWORK_ENGINEER',
  TECHNICIAN = 'TECHNICIAN',
  VIEWER = 'VIEWER'
}

export const PERMISSIONS = [
  'READ_DEVICES',
  'WRITE_DEVICES',
  'DELETE_DEVICES',
  'READ_USERS',
  'WRITE_USERS',
  'DELETE_USERS',
  'READ_ALARMS',
  'ACKNOWLEDGE_ALARMS',
  'READ_DASHBOARD',
  'MANAGE_SETTINGS'
] as const;

export type Permission = typeof PERMISSIONS[number];

export interface User {
  id: string;
  username: string;
  email: string;
  role: Role;
  permissions: Permission[];
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  ipAddress: string;
  createdAt: Date;
}
