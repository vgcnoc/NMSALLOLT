/**
 * OLT System Information
 */
export interface OLTSystemInfo {
  hostname: string;
  vendor: string;
  model: string;
  serialNumber: string;
  firmwareVersion: string;
  hardwareVersion: string;
  uptime: number; // seconds
  description?: string;
}

/**
 * OLT Board / Line Card
 */
export interface OLTBoard {
  slot: number;
  boardType: string;
  status: string;
  serialNumber?: string;
  hardwareVersion?: string;
  softwareVersion?: string;
}

/**
 * PON Port information
 */
export interface PonPortInfo {
  slot: number;
  port: number;
  name: string;
  status: string;
  totalOnus: number;
  onlineOnus: number;
  ponType?: string; // GPON, EPON, XG-PON
}

/**
 * ONU/ONT information discovered from OLT
 */
export interface ONUInfo {
  onuId: number;
  serialNumber: string;
  loid?: string;
  vendor?: string;
  model?: string;
  firmware?: string;
  status: string;
  macAddress?: string;
  ipAddress?: string;
  vlan?: number;
  description?: string;
  distance?: number;
  lastOnline?: Date;
  lastOffline?: Date;
  uptimeSeconds?: number;
  ponSlot: number;
  ponPort: number;
}

/**
 * Optical power readings
 */
export interface OpticalPower {
  onuId: number;
  serialNumber?: string;
  rxPower: number; // dBm
  txPower: number; // dBm
  oltRxPower?: number; // dBm (OLT side)
  temperature?: number; // Celsius
  voltage?: number; // V
  biasCurrent?: number; // mA
}

/**
 * Traffic / bandwidth data
 */
export interface TrafficData {
  interfaceName: string;
  inOctets: number;
  outOctets: number;
  inPackets?: number;
  outPackets?: number;
  inErrors?: number;
  outErrors?: number;
  inDiscards?: number;
  outDiscards?: number;
  speed?: number;
  timestamp: Date;
}

/**
 * Memory utilization
 */
export interface MemoryInfo {
  totalBytes: number;
  usedBytes: number;
  freeBytes: number;
  usagePercent: number;
}

/**
 * OLT Alarm
 */
export interface OLTAlarm {
  alarmId?: string;
  severity: 'CRITICAL' | 'MAJOR' | 'WARNING' | 'INFO';
  alarmType: string;
  source: string;
  message: string;
  timestamp: Date;
  cleared?: boolean;
}

/**
 * Device interface information
 */
export interface DeviceInterfaceInfo {
  name: string;
  type: string;
  status: string; // UP, DOWN, TESTING
  speed?: number;
  macAddress?: string;
  ifIndex: number;
  description?: string;
  mtu?: number;
}

/**
 * Credentials passed to driver for connection
 */
export interface DriverCredentials {
  ipAddress: string;
  // SNMP
  snmpVersion?: 'v2c' | 'v3';
  snmpCommunity?: string;
  snmpUsername?: string;
  snmpAuthPassword?: string;
  snmpPrivPassword?: string;
  snmpAuthProtocol?: string;
  snmpPrivProtocol?: string;
  snmpPort?: number;
  // SSH
  sshUsername?: string;
  sshPassword?: string;
  sshPort?: number;
  // API
  apiUsername?: string;
  apiPassword?: string;
  apiPort?: number;
  apiUseSsl?: boolean;
}

/**
 * Vendor-independent OLT Driver Interface
 *
 * Each OLT vendor (ZTE, Huawei, C-Data, HSGQ, HisFocus, VSOL)
 * implements this interface with vendor-specific SNMP OIDs,
 * SSH commands, and parsers.
 *
 * Adding a new vendor requires:
 * 1. Create folder in drivers/olt/<vendor>/
 * 2. Implement this interface
 * 3. Create OID map (if SNMP)
 * 4. Create command profile (if SSH)
 * 5. Create output parser
 * 6. Register in DriverFactory
 */
export interface OLTDriver {
  /** Vendor identifier */
  readonly vendor: string;

  // ── Connection ──────────────────────────────────────────────

  /** Establish connection to the OLT */
  connect(credentials: DriverCredentials): Promise<void>;

  /** Disconnect from the OLT */
  disconnect(): Promise<void>;

  /** Check if currently connected */
  isConnected(): boolean;

  // ── System Information ──────────────────────────────────────

  /** Get full system information */
  getSystemInfo(): Promise<OLTSystemInfo>;

  /** Get firmware/software version */
  getVersion(): Promise<string>;

  /** Get CPU usage percentage (0-100) */
  getCpu(): Promise<number>;

  /** Get memory utilization */
  getMemory(): Promise<MemoryInfo>;

  /** Get device temperature in Celsius */
  getTemperature(): Promise<number>;

  /** Get uptime in seconds */
  getUptime(): Promise<number>;

  // ── Hardware ────────────────────────────────────────────────

  /** Get all boards/line cards */
  getBoards(): Promise<OLTBoard[]>;

  /** Get all PON ports with ONU counts */
  getPonPorts(): Promise<PonPortInfo[]>;

  /** Get all interfaces (uplink, management, etc.) */
  getInterfaces(): Promise<DeviceInterfaceInfo[]>;

  // ── ONU Management ─────────────────────────────────────────

  /** Get all ONUs, optionally filtered by PON port */
  getOnus(ponSlot?: number, ponPort?: number): Promise<ONUInfo[]>;

  /** Get detailed info for a specific ONU */
  getOnuInfo(ponSlot: number, ponPort: number, onuId: number): Promise<ONUInfo>;

  /** Get optical power readings for a specific ONU */
  getOpticalPower(ponSlot: number, ponPort: number, onuId: number): Promise<OpticalPower>;

  /** Get optical power readings for all ONUs on a PON port */
  getOpticalPowerBulk(ponSlot: number, ponPort: number): Promise<OpticalPower[]>;

  /** Reboot a specific ONU */
  rebootOnu(ponSlot: number, ponPort: number, onuId: number): Promise<boolean>;

  // ── Monitoring ──────────────────────────────────────────────

  /** Get traffic data for an interface or PON port */
  getTraffic(interfaceName?: string): Promise<TrafficData[]>;

  /** Get current active alarms */
  getAlarms(): Promise<OLTAlarm[]>;

  // ── Raw Command (for advanced use) ─────────────────────────

  /** Execute a raw SSH command (with safety checks) */
  executeCommand?(command: string): Promise<string>;
}
