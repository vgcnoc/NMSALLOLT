import { Injectable } from '@nestjs/common';

@Injectable()
export class OnusService {
  findAll() { return []; }
  findOne(id: number) { return { id }; }
  getOpticalPower(id: number) { return {}; }
  reboot(id: number) { return true; }
}
