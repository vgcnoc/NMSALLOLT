export const HuaweiCommands = {
  initCommands: ['screen-length 0 temporary', 'undo smart'],
  getSystemInfo: 'display version',
  getBoards: 'display board 0',
  getPonPorts: 'display ont info summary all',
  getOnus: (slot: string, port: string) => `display ont info 0 ${slot} ${port} all`,
  getOnuDetail: (slot: string, port: string, onuId: string) => `display ont info ${slot} ${port} ${onuId} detail`,
  getOpticalPower: (slot: string, port: string, onuId: string) => `display ont optical-info ${slot} ${port} ${onuId}`,
  getAlarms: 'display alarm active all',
  getInterfaces: 'display interface brief',
  getCpu: 'display cpu-usage',
  getMemory: 'display memory-usage',
  getTemperature: 'display temperature all',
  getTraffic: (iface: string) => `display interface ${iface}`
};
