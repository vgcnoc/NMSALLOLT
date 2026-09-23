export interface SshConnectionConfig {
  host: string;
  port?: number;
  username: string;
  password?: string;
  timeout?: number;
  readyTimeout?: number;
}
export interface SshCommandResult {
  output: string;
}
export type SshConnection = any; // ssh2.Client
