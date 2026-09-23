export const ZteCommands = {
  initCommands: ['terminal length 0'],
  getSystemInfo: 'show system-group',
  getVersion: 'show version',
  getBoards: 'show card',
  getPonPorts: 'show gpon onu state',
  getOnus: (slot: string, port: string) => `show gpon onu state gpon-olt_${slot}/${port}`,
  getOnuDetail: (slot: string, port: string, onuId: string) => `show gpon onu detail-info gpon-onu_${slot}/${port}:${onuId}`,
  getOpticalPower: (slot: string, port: string) => `show pon power onu-rx gpon-olt_${slot}/${port}`,
  getOltRxPower: (slot: string, port: string) => `show pon power olt-rx gpon-olt_${slot}/${port}`,
  getAlarms: 'show alarm current',
  getInterfaces: 'show interface brief',
  getCpu: 'show processor',
  getMemory: 'show memory',
  getTemperature: 'show temperature',
  getTraffic: (iface: string) => `show interface ${iface}`
};
