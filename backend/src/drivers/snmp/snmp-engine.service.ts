import { Injectable } from '@nestjs/common';
import * as snmp from 'net-snmp';
import { SnmpOptions, SnmpV3SecurityParams, SnmpVarbind, SnmpResult } from './snmp.types';

@Injectable()
export class SnmpEngineService {
  createSession(ip: string, community: string, options?: SnmpOptions) {
    const opts = {
      port: options?.port || 161,
      retries: options?.retries || 1,
      timeout: options?.timeout || 5000,
      version: options?.version === 'v3' ? snmp.Version3 : snmp.Version2c,
    };
    return snmp.createSession(ip, community, opts);
  }

  closeSession(session: any) {
    if (session) {
      session.close();
    }
  }

  async get(ip: string, community: string, oids: string[], options?: SnmpOptions): Promise<SnmpResult> {
    const session = this.createSession(ip, community, options);
    return new Promise((resolve, reject) => {
      session.get(oids, (error: any, varbinds: any) => {
        this.closeSession(session);
        if (error) {
          reject(error);
        } else {
          resolve({ varbinds });
        }
      });
    });
  }

  async getBulk(ip: string, community: string, oids: string[], options?: SnmpOptions): Promise<SnmpResult> {
    const session = this.createSession(ip, community, options);
    return new Promise((resolve, reject) => {
      session.getBulk(0, 10, oids, (error: any, varbinds: any) => {
        this.closeSession(session);
        if (error) {
          reject(error);
        } else {
          resolve({ varbinds });
        }
      });
    });
  }

  async walk(ip: string, community: string, oid: string, options?: SnmpOptions): Promise<SnmpResult> {
    const session = this.createSession(ip, community, options);
    const resultVarbinds: SnmpVarbind[] = [];
    return new Promise((resolve, reject) => {
      session.subtree(oid, 10, (varbinds: any) => {
        resultVarbinds.push(...varbinds);
      }, (error: any) => {
        this.closeSession(session);
        if (error) {
          reject(error);
        } else {
          resolve({ varbinds: resultVarbinds });
        }
      });
    });
  }

  async getV3(ip: string, securityParams: SnmpV3SecurityParams, oids: string[]): Promise<SnmpResult> {
    const user = {
      name: securityParams.user,
      level: snmp.SecurityLevel.authPriv,
      authProtocol: snmp.AuthProtocols[securityParams.authProtocol],
      authKey: securityParams.authKey,
      privProtocol: snmp.PrivProtocols[securityParams.privProtocol],
      privKey: securityParams.privKey,
    };
    const session = snmp.createV3Session(ip, user, { timeout: 5000, retries: 1 });
    return new Promise((resolve, reject) => {
      session.get(oids, (error: any, varbinds: any) => {
        this.closeSession(session);
        if (error) {
          reject(error);
        } else {
          resolve({ varbinds });
        }
      });
    });
  }
}
