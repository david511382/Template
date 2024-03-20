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
    cors: {
      origins: string[];
    };
  };
  auth: {
    jwtKey: string;
    verifyUrl: string;
    forgetPswUrl: string;
    signupResendMailTimeoutSec: number;
    forgetPswResendMailTimeoutMin: number;
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
  db: {
    user: {
      schema: string;
      host: string;
      port: number;
      user: string;
      password: string;
      database: string;
      url: string;
    };
    operationRecord: {
      schema: string;
      host: string;
      port: number;
      user: string;
      password: string;
      database: string;
      url: string;
    };
  };
  email: {
    host: string;
    port: number;
    username: string;
    password: string;
    from: string;
  };
}
export const IConfigType = Symbol('IConfig');
