import { Injectable, Logger } from '@nestjs/common';
import { Client } from 'ssh2';
import { SshConnectionConfig, SshCommandResult, SshConnection } from './ssh.types';

@Injectable()
export class SshEngineService {
  private readonly logger = new Logger(SshEngineService.name);

  async connect(config: SshConnectionConfig): Promise<SshConnection> {
    return new Promise((resolve, reject) => {
      const conn = new Client();
      conn.on('ready', () => {
        resolve(conn);
      }).on('error', (err) => {
        reject(err);
      }).connect({
        host: config.host,
        port: config.port || 22,
        username: config.username,
        password: config.password,
        readyTimeout: config.readyTimeout || 20000,
      });
    });
  }

  async executeCommand(connection: SshConnection, command: string, options?: any): Promise<string> {
    return new Promise((resolve, reject) => {
      connection.exec(command, (err: any, stream: any) => {
        if (err) return reject(err);
        let output = '';
        stream.on('close', () => {
          resolve(output);
        }).on('data', (data: any) => {
          output += data;
        }).stderr.on('data', (data: any) => {
          this.logger.warn(`SSH STDERR: ${data}`);
        });
      });
    });
  }

  async executeInteractive(connection: SshConnection, commands: string[], promptRegex: RegExp, options?: any): Promise<string> {
    return new Promise((resolve, reject) => {
      connection.shell((err: any, stream: any) => {
        if (err) return reject(err);
        let output = '';
        let commandIndex = 0;
        
        stream.on('close', () => resolve(output))
          .on('data', (data: any) => {
            const str = data.toString();
            output += str;
            if (promptRegex.test(str)) {
              if (commandIndex < commands.length) {
                stream.write(commands[commandIndex] + '\n');
                commandIndex++;
              } else {
                stream.end();
              }
            }
          });
          
          if (commands.length > 0) {
              stream.write(commands[0] + '\n');
              commandIndex++;
          }
      });
    });
  }

  disconnect(connection: SshConnection) {
    if (connection) {
      connection.end();
    }
  }

  isConnected(connection: SshConnection): boolean {
    return connection != null;
  }
}
