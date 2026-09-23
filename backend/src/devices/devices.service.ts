import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CredentialsService } from './credentials.service';

@Injectable()
export class DevicesService {
  constructor(
    private prisma: PrismaService,
    private credentialsService: CredentialsService
  ) {}

  async findAll() {
    return this.prisma.device.findMany();
  }

  async findById(id: string) {
    const device = await this.prisma.device.findUnique({
      where: { id },
      include: {
        pop: true,
        interfaces: true,
        olt: true,
        mikrotik: true
      }
    });
    if (!device) throw new NotFoundException('Device not found');
    return device;
  }

  async create(dto: any) {
    // Basic extraction
    const { 
      name, type, vendor, model, ipAddress, managementIp, port, 
      serialNumber, firmwareVersion, popId, latitude, longitude, description,
      apiUsername, apiPassword, sshUsername, sshPassword, snmpCommunity, snmpVersion 
    } = dto;

    // Encrypt credentials
    const credsToEncrypt = {
      apiUsernameEnc: apiUsername || '',
      apiPasswordEnc: apiPassword || '',
      sshUsernameEnc: sshUsername || '',
      sshPasswordEnc: sshPassword || '',
      snmpCommunityEnc: snmpCommunity || '',
    };
    const encrypted = this.credentialsService.encryptCredentials(credsToEncrypt);

    // Prisma transaction to create device and credentials
    const device = await this.prisma.$transaction(async (tx) => {
      const dev = await tx.device.create({
        data: {
          name, type, vendor: vendor || 'OTHER', model, ipAddress, managementIp, port,
          serialNumber, firmwareVersion, popId, latitude, longitude, description,
          status: 'UNKNOWN'
        }
      });

      // Create credentials
      await tx.deviceCredential.create({
        data: {
          deviceId: dev.id,
          apiUsernameEnc: encrypted.apiUsernameEnc || null,
          apiPasswordEnc: encrypted.apiPasswordEnc || null,
          sshUsernameEnc: encrypted.sshUsernameEnc || null,
          sshPasswordEnc: encrypted.sshPasswordEnc || null,
          snmpCommunityEnc: encrypted.snmpCommunityEnc || null,
          snmpVersion: snmpVersion || 'v2c',
          protocol: 'UNKNOWN', // Satisfy prisma requirement
          encryptionIv: 'bundled', // Satisfy prisma requirement
        }
      });

      // If it's an OLT, create the OLT record
      if (type === 'OLT') {
        await tx.olt.create({
          data: {
            deviceId: dev.id,
            oltType: model || 'UNKNOWN',
            totalPonPorts: 0,
            totalBoards: 0,
          }
        });
      }

      return dev;
    });

    return device;
  }
}
