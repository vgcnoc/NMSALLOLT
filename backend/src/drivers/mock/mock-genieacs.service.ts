import { Injectable } from '@nestjs/common';
@Injectable()
export class MockGenieAcsService {
  async getDevices() { return []; }
}
