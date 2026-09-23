import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  getOverview() { return { counts: { devices: 10, olts: 2, onts: 50, mikrotik: 1, alarms: 0 } }; }
  getOntStatus() { return []; }
  getTraffic() { return []; }
  getAlarms() { return []; }
}
