import { Injectable } from '@nestjs/common';
import { CreatePopDto } from './dto/create-pop.dto';

@Injectable()
export class PopsService {
  findAll() { return []; }
  findOne(id: number) { return { id }; }
  create(createPopDto: CreatePopDto) { return createPopDto; }
  update(id: number, updatePopDto: any) { return { id, ...updatePopDto }; }
  remove(id: number) { return true; }
  getDevices(id: number) { return []; }
}
