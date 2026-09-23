import { Module } from '@nestjs/common';
import { SnmpEngineService } from './snmp/snmp-engine.service';
import { SshEngineService } from './ssh/ssh-engine.service';
import { ZteDriver } from './olt/zte.driver';
import { HuaweiDriver } from './olt/huawei.driver';
import { CdataDriver } from './olt/cdata.driver';
import { GenericDriver } from './olt/generic.driver';
import { MockOltDriver } from './mock/mock-olt.driver';
import { EponWebDriver } from './olt/epon-web.driver';
import { MikrotikDriver } from './router/mikrotik.driver';
import { DriverFactory } from './driver-factory.service';

@Module({
  providers: [
    SnmpEngineService,
    SshEngineService,
    ZteDriver,
    HuaweiDriver,
    CdataDriver,
    GenericDriver,
    MockOltDriver,
    EponWebDriver,
    MikrotikDriver,
    DriverFactory,
  ],
  exports: [
    SnmpEngineService,
    SshEngineService,
    ZteDriver,
    HuaweiDriver,
    CdataDriver,
    GenericDriver,
    MockOltDriver,
    EponWebDriver,
    MikrotikDriver,
    DriverFactory,
  ],
})
export class DriversModule {}
