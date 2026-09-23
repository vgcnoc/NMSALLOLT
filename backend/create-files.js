const fs = require('fs');
const path = require('path');

const files = {
  'src/drivers/snmp/snmp.types.ts': `export interface SnmpOptions {
  version?: 'v2c' | 'v3';
  timeout?: number;
  retries?: number;
  port?: number;
}
export interface SnmpV3SecurityParams {
  user: string;
  level: string;
  authProtocol: string;
  authKey: string;
  privProtocol: string;
  privKey: string;
}
export interface SnmpVarbind {
  oid: string;
  type: number;
  value: any;
}
export interface SnmpResult {
  varbinds: SnmpVarbind[];
}`,
  'src/drivers/snmp/snmp-engine.service.ts': `import { Injectable } from '@nestjs/common';
import * as snmp from 'net-snmp';
import { SnmpOptions, SnmpV3SecurityParams, SnmpVarbind, SnmpResult } from './snmp.types';

@Injectable()
export class SnmpEngineService {
  createSession(ip: string, community: string, options?: SnmpOptions) {
    const opts = {
      port: options?.port || 161,
      retries: options?.retries || 1,
      timeout: options?.timeout || 5000,
      version: options?.version === 'v3' ? snmp.Version3 : snmp.Version2c,
    };
    return snmp.createSession(ip, community, opts);
  }

  closeSession(session: any) {
    if (session) {
      session.close();
    }
  }

  async get(ip: string, community: string, oids: string[], options?: SnmpOptions): Promise<SnmpResult> {
    const session = this.createSession(ip, community, options);
    return new Promise((resolve, reject) => {
      session.get(oids, (error: any, varbinds: any) => {
        this.closeSession(session);
        if (error) {
          reject(error);
        } else {
          resolve({ varbinds });
        }
      });
    });
  }

  async getBulk(ip: string, community: string, oids: string[], options?: SnmpOptions): Promise<SnmpResult> {
    const session = this.createSession(ip, community, options);
    return new Promise((resolve, reject) => {
      session.getBulk(0, 10, oids, (error: any, varbinds: any) => {
        this.closeSession(session);
        if (error) {
          reject(error);
        } else {
          resolve({ varbinds });
        }
      });
    });
  }

  async walk(ip: string, community: string, oid: string, options?: SnmpOptions): Promise<SnmpResult> {
    const session = this.createSession(ip, community, options);
    const resultVarbinds: SnmpVarbind[] = [];
    return new Promise((resolve, reject) => {
      session.subtree(oid, 10, (varbinds: any) => {
        resultVarbinds.push(...varbinds);
      }, (error: any) => {
        this.closeSession(session);
        if (error) {
          reject(error);
        } else {
          resolve({ varbinds: resultVarbinds });
        }
      });
    });
  }

  async getV3(ip: string, securityParams: SnmpV3SecurityParams, oids: string[]): Promise<SnmpResult> {
    const user = {
      name: securityParams.user,
      level: snmp.SecurityLevel.authPriv,
      authProtocol: snmp.AuthProtocols[securityParams.authProtocol],
      authKey: securityParams.authKey,
      privProtocol: snmp.PrivProtocols[securityParams.privProtocol],
      privKey: securityParams.privKey,
    };
    const session = snmp.createV3Session(ip, user, { timeout: 5000, retries: 1 });
    return new Promise((resolve, reject) => {
      session.get(oids, (error: any, varbinds: any) => {
        this.closeSession(session);
        if (error) {
          reject(error);
        } else {
          resolve({ varbinds });
        }
      });
    });
  }
}
`,
  'src/drivers/ssh/ssh.types.ts': `export interface SshConnectionConfig {
  host: string;
  port?: number;
  username: string;
  password?: string;
  timeout?: number;
  readyTimeout?: number;
}
export interface SshCommandResult {
  output: string;
}
export type SshConnection = any; // ssh2.Client`,
  'src/drivers/ssh/ssh-engine.service.ts': `import { Injectable, Logger } from '@nestjs/common';
import { Client } from 'ssh2';
import { SshConnectionConfig, SshCommandResult, SshConnection } from './ssh.types';

@Injectable()
export class SshEngineService {
  private readonly logger = new Logger(SshEngineService.name);

  async connect(config: SshConnectionConfig): Promise<SshConnection> {
    return new Promise((resolve, reject) => {
      const conn = new Client();
      conn.on('ready', () => {
        resolve(conn);
      }).on('error', (err) => {
        reject(err);
      }).connect({
        host: config.host,
        port: config.port || 22,
        username: config.username,
        password: config.password,
        readyTimeout: config.readyTimeout || 20000,
      });
    });
  }

  async executeCommand(connection: SshConnection, command: string, options?: any): Promise<string> {
    return new Promise((resolve, reject) => {
      connection.exec(command, (err: any, stream: any) => {
        if (err) return reject(err);
        let output = '';
        stream.on('close', () => {
          resolve(output);
        }).on('data', (data: any) => {
          output += data;
        }).stderr.on('data', (data: any) => {
          this.logger.warn(\`SSH STDERR: \${data}\`);
        });
      });
    });
  }

  async executeInteractive(connection: SshConnection, commands: string[], promptRegex: RegExp, options?: any): Promise<string> {
    return new Promise((resolve, reject) => {
      connection.shell((err: any, stream: any) => {
        if (err) return reject(err);
        let output = '';
        let commandIndex = 0;
        
        stream.on('close', () => resolve(output))
          .on('data', (data: any) => {
            const str = data.toString();
            output += str;
            if (promptRegex.test(str)) {
              if (commandIndex < commands.length) {
                stream.write(commands[commandIndex] + '\\n');
                commandIndex++;
              } else {
                stream.end();
              }
            }
          });
          
          if (commands.length > 0) {
              stream.write(commands[0] + '\\n');
              commandIndex++;
          }
      });
    });
  }

  disconnect(connection: SshConnection) {
    if (connection) {
      connection.end();
    }
  }

  isConnected(connection: SshConnection): boolean {
    return connection != null;
  }
}
`,
  'src/drivers/ssh/command-profiles/zte.commands.ts': `export const ZteCommands = {
  initCommands: ['terminal length 0'],
  getSystemInfo: 'show system-group',
  getVersion: 'show version',
  getBoards: 'show card',
  getPonPorts: 'show gpon onu state',
  getOnus: (slot: string, port: string) => \`show gpon onu state gpon-olt_\${slot}/\${port}\`,
  getOnuDetail: (slot: string, port: string, onuId: string) => \`show gpon onu detail-info gpon-onu_\${slot}/\${port}:\${onuId}\`,
  getOpticalPower: (slot: string, port: string) => \`show pon power onu-rx gpon-olt_\${slot}/\${port}\`,
  getOltRxPower: (slot: string, port: string) => \`show pon power olt-rx gpon-olt_\${slot}/\${port}\`,
  getAlarms: 'show alarm current',
  getInterfaces: 'show interface brief',
  getCpu: 'show processor',
  getMemory: 'show memory',
  getTemperature: 'show temperature',
  getTraffic: (iface: string) => \`show interface \${iface}\`
};`,
  'src/drivers/ssh/command-profiles/huawei.commands.ts': `export const HuaweiCommands = {
  initCommands: ['screen-length 0 temporary', 'undo smart'],
  getSystemInfo: 'display version',
  getBoards: 'display board 0',
  getPonPorts: 'display ont info summary all',
  getOnus: (slot: string, port: string) => \`display ont info 0 \${slot} \${port} all\`,
  getOnuDetail: (slot: string, port: string, onuId: string) => \`display ont info \${slot} \${port} \${onuId} detail\`,
  getOpticalPower: (slot: string, port: string, onuId: string) => \`display ont optical-info \${slot} \${port} \${onuId}\`,
  getAlarms: 'display alarm active all',
  getInterfaces: 'display interface brief',
  getCpu: 'display cpu-usage',
  getMemory: 'display memory-usage',
  getTemperature: 'display temperature all',
  getTraffic: (iface: string) => \`display interface \${iface}\`
};`,
  'src/drivers/ssh/command-profiles/cdata.commands.ts': `export const CDataCommands = {
  initCommands: ['terminal length 0'],
  getSystemInfo: 'show version',
  getBoards: 'show board',
  getPonPorts: 'show pon',
  getOnus: (slot: string, port: string) => \`show onu \${slot}/\${port}\`,
  getOnuDetail: (slot: string, port: string, onuId: string) => \`show onu \${slot}/\${port}:\${onuId}\`,
  getOpticalPower: (slot: string, port: string) => \`show pon optical \${slot}/\${port}\`,
  getOltRxPower: (slot: string, port: string) => \`show pon olt-rx \${slot}/\${port}\`,
  getAlarms: 'show alarm active',
  getInterfaces: 'show interface brief',
  getCpu: 'show cpu',
  getMemory: 'show memory',
  getTemperature: 'show environment',
  getTraffic: (iface: string) => \`show interface \${iface}\`
};`,
  'src/drivers/ssh/command-profiles/generic.commands.ts': `export const GenericCommands = {
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
};`,
  'src/drivers/mock/mock-olt.driver.ts': `import { Injectable } from '@nestjs/common';
import { OLTDriver, OLTSystemInfo, PonPortInfo, ONUInfo, OpticalPower, TrafficData, MemoryInfo, OLTAlarm, DeviceInterfaceInfo } from '../interfaces/olt-driver.interface';

@Injectable()
export class MockOltDriver implements OLTDriver {
  async connect(): Promise<boolean> { return true; }
  async disconnect(): Promise<void> {}
  
  async getSystemInfo(): Promise<OLTSystemInfo> {
    return {
      vendor: 'ZTE',
      model: 'C320',
      firmwareVersion: 'V2.1.0',
      uptime: 30 * 24 * 3600,
      cpuUsage: Math.floor(Math.random() * 30 + 15),
      memoryUsage: { total: 1024, used: Math.floor(Math.random() * 200 + 400), free: 0, usagePercentage: Math.floor(Math.random() * 25 + 40) },
      temperature: Math.floor(Math.random() * 20 + 35)
    };
  }

  async getBoards(): Promise<any[]> {
    return [{ slot: 1, type: 'GTGO' }, { slot: 2, type: 'GTGH' }];
  }

  async getPonPorts(): Promise<PonPortInfo[]> {
    const ports = [];
    for(let i=1; i<=8; i++) {
      ports.push({ name: \`gpon-olt_1/\${i}\`, slot: '1', port: i.toString(), adminState: 'up', operState: 'up', onuCount: Math.floor(Math.random() * 27 + 5) });
    }
    return ports;
  }

  async getOnus(port: string): Promise<ONUInfo[]> {
    return [{ onuId: '1', serialNumber: 'ZTEG' + Math.floor(Math.random()*100000000).toString(), status: 'online' }];
  }
  
  async getOnuDetail(onuId: string): Promise<any> { return {}; }
  
  async getOpticalPower(onuId: string): Promise<OpticalPower> {
    return { rxPower: - (Math.random() * 8 + 18), txPower: Math.random() * 2 + 1.5, temperature: 40, voltage: 3.3, biasCurrent: 15 };
  }
  
  async getAlarms(): Promise<OLTAlarm[]> { return []; }
  async getInterfaces(): Promise<DeviceInterfaceInfo[]> { return []; }
  async getTraffic(iface: string): Promise<TrafficData> { return { rxBytes: 1000, txBytes: 2000, rxRate: 100, txRate: 200 }; }
}`,
  'src/drivers/mock/mock-mikrotik.driver.ts': `import { Injectable } from '@nestjs/common';

@Injectable()
export class MockMikrotikDriver {
  async connect(): Promise<boolean> { return true; }
  async disconnect(): Promise<void> {}
  async getSystemInfo() {
    return { board: 'CCR1036-8G-2S+', version: '7.12', cpu: 25, memory: { total: 1024, used: 512, free: 512, usagePercentage: 50 }, uptime: 60*24*3600 };
  }
  async getInterfaces() { return []; }
  async getTraffic(iface: string) { return { rxBytes: 1000, txBytes: 2000, rxRate: 100, txRate: 200 }; }
}`,
  'src/drivers/mock/mock-snmp.service.ts': `import { Injectable } from '@nestjs/common';
@Injectable()
export class MockSnmpService {
  async get() { return { varbinds: [] }; }
  async walk() { return { varbinds: [] }; }
}`,
  'src/drivers/mock/mock-genieacs.service.ts': `import { Injectable } from '@nestjs/common';
@Injectable()
export class MockGenieAcsService {
  async getDevices() { return []; }
}`,
  'src/drivers/driver-factory.service.ts': `import { Injectable } from '@nestjs/common';
import { MockOltDriver } from './mock/mock-olt.driver';
import { MockMikrotikDriver } from './mock/mock-mikrotik.driver';

@Injectable()
export class DriverFactory {
  constructor(private mockOlt: MockOltDriver, private mockMt: MockMikrotikDriver) {}
  createOltDriver(vendor: string, model?: string) { return this.mockOlt; }
  createRouterDriver(vendor: string) { return this.mockMt; }
  getSupportedVendors() { return ['ZTE', 'Huawei', 'C-Data']; }
}`,
  'src/drivers/drivers.module.ts': `import { Module } from '@nestjs/common';
import { DriverFactory } from './driver-factory.service';
import { SnmpEngineService } from './snmp/snmp-engine.service';
import { SshEngineService } from './ssh/ssh-engine.service';
import { MockOltDriver } from './mock/mock-olt.driver';
import { MockMikrotikDriver } from './mock/mock-mikrotik.driver';
import { MockSnmpService } from './mock/mock-snmp.service';
import { MockGenieAcsService } from './mock/mock-genieacs.service';

@Module({
  providers: [DriverFactory, SnmpEngineService, SshEngineService, MockOltDriver, MockMikrotikDriver, MockSnmpService, MockGenieAcsService],
  exports: [DriverFactory, SnmpEngineService, SshEngineService]
})
export class DriversModule {}`,
  'src/workers/workers.module.ts': `import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ScheduleModule } from '@nestjs/schedule';
import { DriversModule } from '../drivers/drivers.module';
import { SnmpPollerWorker } from './snmp-poller.worker';
import { SshPollerWorker } from './ssh-poller.worker';
import { MikrotikPollerWorker } from './mikrotik-poller.worker';
import { AlarmProcessorWorker } from './alarm-processor.worker';
import { SchedulerService } from './scheduler.service';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: 'snmp-poll' },
      { name: 'ssh-poll' },
      { name: 'mikrotik-poll' },
      { name: 'genieacs-sync' },
      { name: 'alarm-process' },
      { name: 'notification-send' },
      { name: 'device-discovery' },
      { name: 'metric-aggregate' },
    ),
    DriversModule,
  ],
  providers: [SnmpPollerWorker, SshPollerWorker, MikrotikPollerWorker, AlarmProcessorWorker, SchedulerService],
})
export class WorkersModule {}`,
  'src/workers/snmp-poller.worker.ts': `import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';

@Processor('snmp-poll')
export class SnmpPollerWorker extends WorkerHost {
  private readonly logger = new Logger(SnmpPollerWorker.name);
  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(\`Processing SNMP poll job for device: \${job.data.deviceId}\`);
    return true;
  }
}`,
  'src/workers/ssh-poller.worker.ts': `import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';

@Processor('ssh-poll')
export class SshPollerWorker extends WorkerHost {
  private readonly logger = new Logger(SshPollerWorker.name);
  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(\`Processing SSH poll job for device: \${job.data.deviceId}\`);
    return true;
  }
}`,
  'src/workers/mikrotik-poller.worker.ts': `import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';

@Processor('mikrotik-poll')
export class MikrotikPollerWorker extends WorkerHost {
  private readonly logger = new Logger(MikrotikPollerWorker.name);
  async process(job: Job<any, any, string>): Promise<any> {
    return true;
  }
}`,
  'src/workers/alarm-processor.worker.ts': `import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('alarm-process')
export class AlarmProcessorWorker extends WorkerHost {
  async process(job: Job<any, any, string>): Promise<any> { return true; }
}`,
  'src/workers/scheduler.service.ts': `import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);
  
  @Cron(CronExpression.EVERY_5_MINUTES)
  handleSnmpPoll() { this.logger.log('Scheduling SNMP Polls'); }
  
  @Cron(CronExpression.EVERY_10_MINUTES)
  handleSshPoll() { this.logger.log('Scheduling SSH Polls'); }
}`,
  'src/pops/pops.module.ts': `import { Module } from '@nestjs/common';
import { PopsController } from './pops.controller';
import { PopsService } from './pops.service';

@Module({
  controllers: [PopsController],
  providers: [PopsService],
  exports: [PopsService]
})
export class PopsModule {}`,
  'src/pops/pops.controller.ts': `import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PopsService } from './pops.service';
import { CreatePopDto } from './dto/create-pop.dto';

@Controller('pops')
export class PopsController {
  constructor(private readonly popsService: PopsService) {}
  
  @Get()
  findAll() { return this.popsService.findAll(); }
  
  @Get(':id')
  findOne(@Param('id') id: string) { return this.popsService.findOne(+id); }
  
  @Post()
  create(@Body() createPopDto: CreatePopDto) { return this.popsService.create(createPopDto); }
  
  @Put(':id')
  update(@Param('id') id: string, @Body() updatePopDto: any) { return this.popsService.update(+id, updatePopDto); }
  
  @Delete(':id')
  remove(@Param('id') id: string) { return this.popsService.remove(+id); }
  
  @Get(':id/devices')
  getDevices(@Param('id') id: string) { return this.popsService.getDevices(+id); }
}`,
  'src/pops/pops.service.ts': `import { Injectable } from '@nestjs/common';
import { CreatePopDto } from './dto/create-pop.dto';

@Injectable()
export class PopsService {
  findAll() { return []; }
  findOne(id: number) { return { id }; }
  create(createPopDto: CreatePopDto) { return createPopDto; }
  update(id: number, updatePopDto: any) { return { id, ...updatePopDto }; }
  remove(id: number) { return true; }
  getDevices(id: number) { return []; }
}`,
  'src/pops/dto/create-pop.dto.ts': `export class CreatePopDto {
  name: string;
  code: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  region?: string;
  description?: string;
}`,
  'src/pops/dto/update-pop.dto.ts': `export class UpdatePopDto {}`,
  'src/olts/olts.module.ts': `import { Module } from '@nestjs/common';
import { OltsController } from './olts.controller';
import { OltsService } from './olts.service';
import { PonPortsService } from './pon-ports.service';
import { DriversModule } from '../drivers/drivers.module';

@Module({
  imports: [DriversModule],
  controllers: [OltsController],
  providers: [OltsService, PonPortsService],
  exports: [OltsService]
})
export class OltsModule {}`,
  'src/olts/olts.controller.ts': `import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { OltsService } from './olts.service';

@Controller('olts')
export class OltsController {
  constructor(private readonly oltsService: OltsService) {}
  
  @Get()
  findAll() { return this.oltsService.findAll(); }
  
  @Get(':id')
  findOne(@Param('id') id: string) { return this.oltsService.findOne(+id); }
  
  @Get(':id/boards')
  getBoards(@Param('id') id: string) { return this.oltsService.getBoards(+id); }
  
  @Get(':id/pon-ports')
  getPonPorts(@Param('id') id: string) { return this.oltsService.getPonPorts(+id); }
  
  @Get(':id/onus')
  getOnus(@Param('id') id: string) { return this.oltsService.getOnus(+id); }
  
  @Get(':id/alarms')
  getAlarms(@Param('id') id: string) { return this.oltsService.getAlarms(+id); }
  
  @Post(':id/poll')
  pollOlt(@Param('id') id: string) { return this.oltsService.pollOlt(+id); }
}`,
  'src/olts/olts.service.ts': `import { Injectable } from '@nestjs/common';
import { DriverFactory } from '../drivers/driver-factory.service';

@Injectable()
export class OltsService {
  constructor(private driverFactory: DriverFactory) {}
  findAll() { return []; }
  findOne(id: number) { return { id }; }
  getBoards(id: number) { return []; }
  getPonPorts(id: number) { return []; }
  getOnus(id: number) { return []; }
  getAlarms(id: number) { return []; }
  pollOlt(id: number) { return true; }
}`,
  'src/olts/pon-ports.service.ts': `import { Injectable } from '@nestjs/common';

@Injectable()
export class PonPortsService {
  findAll() { return []; }
}`,
  'src/onus/onus.module.ts': `import { Module } from '@nestjs/common';
import { OnusController } from './onus.controller';
import { OnusService } from './onus.service';

@Module({
  controllers: [OnusController],
  providers: [OnusService],
  exports: [OnusService]
})
export class OnusModule {}`,
  'src/onus/onus.controller.ts': `import { Controller, Get, Param, Post } from '@nestjs/common';
import { OnusService } from './onus.service';

@Controller('onus')
export class OnusController {
  constructor(private readonly onusService: OnusService) {}
  
  @Get()
  findAll() { return this.onusService.findAll(); }
  
  @Get(':id')
  findOne(@Param('id') id: string) { return this.onusService.findOne(+id); }
  
  @Get(':id/optical-power')
  getOpticalPower(@Param('id') id: string) { return this.onusService.getOpticalPower(+id); }
  
  @Post(':id/reboot')
  reboot(@Param('id') id: string) { return this.onusService.reboot(+id); }
}`,
  'src/onus/onus.service.ts': `import { Injectable } from '@nestjs/common';

@Injectable()
export class OnusService {
  findAll() { return []; }
  findOne(id: number) { return { id }; }
  getOpticalPower(id: number) { return {}; }
  reboot(id: number) { return true; }
}`,
  'src/dashboard/dashboard.module.ts': `import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}`,
  'src/dashboard/dashboard.controller.ts': `import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}
  
  @Get('overview')
  getOverview() { return this.dashboardService.getOverview(); }
  
  @Get('charts/ont-status')
  getOntStatus() { return this.dashboardService.getOntStatus(); }
  
  @Get('charts/traffic')
  getTraffic() { return this.dashboardService.getTraffic(); }
  
  @Get('charts/alarms')
  getAlarms() { return this.dashboardService.getAlarms(); }
}`,
  'src/dashboard/dashboard.service.ts': `import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  getOverview() { return { counts: { devices: 10, olts: 2, onts: 50, mikrotik: 1, alarms: 0 } }; }
  getOntStatus() { return []; }
  getTraffic() { return []; }
  getAlarms() { return []; }
}`,
  'src/search/search.module.ts': `import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}`,
  'src/search/search.controller.ts': `import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}
  
  @Get()
  search(@Query('q') query: string) { return this.searchService.search(query); }
}`,
  'src/search/search.service.ts': `import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchService {
  search(query: string) { return []; }
}`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join('c:/Users/v/Documents/XAMPP/htdocs/NMSALLOLT/backend', filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}
console.log('All files created successfully.');
