export interface GenieACSDevice {
  _id: string;
  _lastBootstrap: Date;
  _lastBoot: Date;
  Summary: {
    Manufacturer: string;
    OUI: string;
    ProductClass: string;
    SerialNumber: string;
    SoftwareVersion: string;
  };
  InternetGatewayDevice?: any;
  Device?: any;
}

export interface GenieACSTask {
  _id: string;
  device: string;
  name: string;
  timestamp: Date;
  status: string;
}

export interface GenieACSFault {
  _id: string;
  device: string;
  faultCode: string;
  faultString: string;
  timestamp: Date;
}

export interface GenieACSPreset {
  _id: string;
  weight: number;
  precondition: string;
  configurations: any[];
}
