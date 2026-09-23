export interface DashboardOverview {
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  activeAlarms: number;
  totalUsers: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
  }[];
}

export interface AlarmSummary {
  critical: number;
  major: number;
  warning: number;
  info: number;
}

export interface TrafficData {
  timestamp: Date;
  inBytes: number;
  outBytes: number;
}
