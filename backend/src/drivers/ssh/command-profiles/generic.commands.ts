export const GenericCommands = {
  initCommands: [],
  getSystemInfo: '',
  getVersion: '',
  getBoards: '',
  getPonPorts: '',
  getOnus: (slot: string, port: string) => '',
  getOnuDetail: (slot: string, port: string, onuId: string) => '',
  getOpticalPower: (slot: string, port: string) => '',
  getOltRxPower: (slot: string, port: string) => '',
  getAlarms: '',
  getInterfaces: '',
  getCpu: '',
  getMemory: '',
  getTemperature: '',
  getTraffic: (iface: string) => ''
};
