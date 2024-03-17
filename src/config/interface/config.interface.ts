import { LogLevelNameEnum } from '../../infra/log/enum/log-level.enum';
import { EnvEnum } from '../enum/env.enum';

export interface IConfig {
  env: EnvEnum;
  tz: string;
  appName: string;
  http: {
    host: string;
    port: number;
    protocol: string;
  };
  ide: {
    hosts: string[];
    port: number;
    protocol: string;
    credential: string;
  };
  firewall: {
    hosts: string[];
    port: number;
    protocol: string;
    credential: string;
  };
  loginRequirement: {
    enableHours: number;
  };
  auth: {
    jwtKey: string;
  };
  captcha: {
    timeoutMins: number;
  };
  cronServer: {
    host: string;
    port: number;
    protocol: string;
  };
  log: {
    console: {
      level: LogLevelNameEnum;
    };
    file: {
      level: LogLevelNameEnum;
      filename: string;
      dirname: string;
      maxfiles: string;
    };
  };
  redis: {
    host: string;
    port: number;
    password: string;
  };
}
export const IConfigType = Symbol('IConfig');
