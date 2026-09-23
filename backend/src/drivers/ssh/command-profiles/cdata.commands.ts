export const CDataCommands = {
  initCommands: ['terminal length 0'],
  getSystemInfo: 'show version',
  getBoards: 'show board',
  getPonPorts: 'show pon',
  getOnus: (slot: string, port: string) => `show onu ${slot}/${port}`,
  getOnuDetail: (slot: string, port: string, onuId: string) => `show onu ${slot}/${port}:${onuId}`,
  getOpticalPower: (slot: string, port: string) => `show pon optical ${slot}/${port}`,
  getOltRxPower: (slot: string, port: string) => `show pon olt-rx ${slot}/${port}`,
  getAlarms: 'show alarm active',
  getInterfaces: 'show interface brief',
  getCpu: 'show cpu',
  getMemory: 'show memory',
  getTemperature: 'show environment',
  getTraffic: (iface: string) => `show interface ${iface}`
};
