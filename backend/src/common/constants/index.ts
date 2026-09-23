export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export const POLLING_INTERVALS = {
  FAST: 10000,
  NORMAL: 60000,
  SLOW: 300000,
};

export const ALARM_SEVERITIES = {
  CRITICAL: 'CRITICAL',
  MAJOR: 'MAJOR',
  MINOR: 'MINOR',
  WARNING: 'WARNING',
  INFO: 'INFO',
};

export const DEVICE_STATUSES = {
  ONLINE: 'ONLINE',
  OFFLINE: 'OFFLINE',
  WARNING: 'WARNING',
  UNKNOWN: 'UNKNOWN',
};

export const PERMISSION_CODES = [
  'device.view', 'device.create', 'device.update', 'device.delete', 'device.execute',
  'olt.manage', 'olt.view',
  'ont.view', 'ont.manage',
  'mikrotik.manage', 'mikrotik.view',
  'genieacs.manage', 'genieacs.view',
  'map.manage', 'map.view',
  'alarm.manage', 'alarm.view', 'alarm.acknowledge',
  'user.manage', 'user.view',
  'role.manage', 'role.view',
  'audit.view',
  'notification.manage',
  'report.view',
  'discovery.execute',
  'settings.manage',
  'dashboard.view',
];
