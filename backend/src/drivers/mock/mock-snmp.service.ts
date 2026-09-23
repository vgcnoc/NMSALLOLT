import { Injectable } from '@nestjs/common';
@Injectable()
export class MockSnmpService {
  async get() { return { varbinds: [] }; }
  async walk() { return { varbinds: [] }; }
}
