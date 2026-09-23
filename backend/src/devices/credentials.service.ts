import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { encrypt, decrypt } from '../common/utils/encryption.util';

@Injectable()
export class CredentialsService {
  private readonly encryptionKey: string;

  constructor(private configService: ConfigService) {
    this.encryptionKey = this.configService.get<string>('ENCRYPTION_KEY') || '';
    if (!this.encryptionKey) {
      throw new Error('ENCRYPTION_KEY is not defined in environment variables');
    }
  }

  encryptCredentials(plainCredentials: Record<string, any>): Record<string, any> {
    const encrypted: Record<string, any> = {};
    for (const [key, value] of Object.entries(plainCredentials)) {
      if (typeof value === 'string' && value) {
        encrypted[key] = encrypt(value, this.encryptionKey);
      } else {
        encrypted[key] = value;
      }
    }
    return encrypted;
  }

  decryptCredentials(encryptedCredentials: Record<string, any>): Record<string, any> {
    const decrypted: Record<string, any> = {};
    for (const [key, value] of Object.entries(encryptedCredentials)) {
      if (typeof value === 'string' && value && value.includes(':')) {
        decrypted[key] = decrypt(value, this.encryptionKey);
      } else {
        decrypted[key] = value;
      }
    }
    return decrypted;
  }
}
