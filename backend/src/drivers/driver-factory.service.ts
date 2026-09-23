import { Injectable, Logger } from '@nestjs/common';
import { ZteDriver } from './olt/zte.driver';
import { HuaweiDriver } from './olt/huawei.driver';
import { CdataDriver } from './olt/cdata.driver';
import { GenericDriver } from './olt/generic.driver';
import { MockOltDriver } from './mock/mock-olt.driver';
import { OLTDriver } from './interfaces/olt-driver.interface';
import { RouterDriver } from './interfaces/router-driver.interface';
import { MikrotikDriver } from './router/mikrotik.driver';

@Injectable()
export class DriverFactory {
  private readonly logger = new Logger(DriverFactory.name);

  constructor(
    private readonly zteDriver: ZteDriver,
    private readonly huaweiDriver: HuaweiDriver,
    private readonly cdataDriver: CdataDriver,
    private readonly genericDriver: GenericDriver,
    private readonly mockDriver: MockOltDriver,
    private readonly mikrotikDriver: MikrotikDriver,
  ) {}

  createOltDriver(vendor: string, model: string = '', useMock: boolean = false): OLTDriver {
    if (useMock) {
      this.logger.log('Returning Mock OLT Driver');
      return this.mockDriver;
    }

    const lowerVendor = vendor.toLowerCase();
    switch (lowerVendor) {
      case 'zte':
        this.logger.log('Returning ZTE OLT Driver');
        return this.zteDriver;
      case 'huawei':
        this.logger.log('Returning Huawei OLT Driver');
        return this.huaweiDriver;
      case 'cdata':
      case 'c-data':
        this.logger.log('Returning C-Data OLT Driver');
        return this.cdataDriver;
      default:
        this.logger.log(`Returning Generic OLT Driver for unknown vendor: ${vendor}`);
        return this.genericDriver;
    }
  }

  createRouterDriver(vendor: string): RouterDriver {
    const lowerVendor = vendor.toLowerCase();
    switch (lowerVendor) {
      case 'mikrotik':
        this.logger.log('Returning Mikrotik Router Driver');
        return this.mikrotikDriver;
      default:
        throw new Error(`No RouterDriver found for vendor: ${vendor}`);
    }
  }
}
