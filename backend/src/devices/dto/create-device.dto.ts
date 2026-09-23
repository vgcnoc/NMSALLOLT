import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsIP } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDeviceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  vendor?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ipAddress!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  managementIp?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  port?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  serialNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  firmwareVersion?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  popId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  // --- Credentials ---
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  snmpVersion?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  snmpCommunity?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  apiUsername?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  apiPassword?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sshUsername?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sshPassword?: string;
}
