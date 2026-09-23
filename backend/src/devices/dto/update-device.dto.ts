import { PartialType } from '@nestjs/swagger';
import { CreateDeviceDto } from './create-device.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateDeviceDto extends PartialType(CreateDeviceDto) {
  @IsOptional()
  @IsString()
  status?: string;
}
