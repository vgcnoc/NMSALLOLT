export interface MikroTikInterface {
  id: string;
  name: string;
  type: string;
  macAddress: string;
  mtu: number;
  running: boolean;
  disabled: boolean;
  rxByte: number;
  txByte: number;
}

export interface PPPoESession {
  id: string;
  name: string;
  service: string;
  callerId: string;
  uptime: string;
  address: string;
}

export interface MikroTikRoute {
  id: string;
  dstAddress: string;
  gateway: string;
  distance: number;
  active: boolean;
}

export interface BGPPeer {
  id: string;
  name: string;
  remoteAddress: string;
  remoteAs: number;
  state: string;
  uptime: string;
}

export interface DHCPLease {
  id: string;
  address: string;
  macAddress: string;
  server: string;
  status: string;
  expiresAfter: string;
}

export interface MikroTikQueue {
  id: string;
  name: string;
  target: string;
  maxLimit: string;
  burstLimit: string;
  bytes: string;
}

export interface FirewallRule {
  id: string;
  chain: string;
  action: string;
  srcAddress?: string;
  dstAddress?: string;
  protocol?: string;
  disabled: boolean;
}
