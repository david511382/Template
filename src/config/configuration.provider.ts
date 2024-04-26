import { LogLevelNameEnum } from '../infra/log/enum/log-level.enum';
import { EnvEnum } from './enum/env.enum';
import { IConfigType } from './interface/config.interface';

export default {
  provide: IConfigType,
  useFactory: () => {
    return {
      env: process.env.APP_ENV || EnvEnum.Prod,
      tz: process.env.TZ || 'Asia/Taipei',
      appName: process.env.APP_NAME || 'app',
      http: {
        host: process.env.HTTP_HOST || 'localhost',
        port: parseInt(process.env.HTTP_PORT, 10),
        protocol: process.env.HTTP_PROTOCOL || 'http',
        cors: {
          origins: process.env.HTTP_CORS_ORIGINS?.split(',') || [],
        },
      },
      ide: {
        hosts: process.env.IDE_HOSTS.split(','),
        port: parseInt(process.env.IDE_PORT, 10),
        protocol: process.env.IDE_PROTOCOL || 'https',
        credential: process.env.IDE_CREDENTIAL,
      },
      firewall: {
        hosts: process.env.FIREWALL_HOSTS.split(','),
        port: parseInt(process.env.FIREWALL_PORT, 10),
        protocol: process.env.FIREWALL_PROTOCOL || 'https',
        credential: process.env.FIREWALL_CREDENTIAL,
      },
      loginRequirement: {
        enableHours: parseInt(process.env.LOGIN_REQUIREMENT_ENABLE_HOURS, 10),
      },
      auth: {
        jwtKey: process.env.AUTH_JWT_KEY,
      },
      captcha: {
        timeoutMins: parseInt(process.env.CAPTCHA_TIMEOUT_MINS, 10) || 1,
      },
      cronServer: {
        host: process.env.CRON_SERVER_HOST,
        port: parseInt(process.env.CRON_SERVER_PORT, 10),
        protocol: process.env.CRON_SERVER_PROTOCOL || 'https',
      },
      log: {
        console: {
          level: process.env.LOG_CONSOLE_LEVEL || LogLevelNameEnum.Debug,
        },
        file: {
          level: process.env.LOG_FILE_LEVEL || LogLevelNameEnum.Debug,
          filename: process.env.LOG_FILE_FILENAME || '%DATE%.log',
          dirname: process.env.LOG_FILE_DIRNAME || 'logs',
          maxfiles: process.env.LOG_FILE_MAXFILES || '31d',
        },
        loki: {
          level: process.env.LOG_LOKI_LEVEL || LogLevelNameEnum.Debug,
          host: process.env.LOG_LOKI_HOST,
          port: parseInt(process.env.LOG_LOKI_PORT, 10),
          protocol: process.env.LOG_LOKI_PROTOCOL || 'https',
        },
      },
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10),
        password: process.env.REDIS_PASSWORD,
      },
      db: {
        loginRequirement: {
          schema: process.env.DB_LOGIN_REQUIREMENT_SCHEMA,
          host: process.env.DB_LOGIN_REQUIREMENT_HOST,
          port: parseInt(process.env.DB_LOGIN_REQUIREMENT_PORT, 10),
          user: process.env.DB_LOGIN_REQUIREMENT_USER,
          password: process.env.DB_LOGIN_REQUIREMENT_PASSWORD,
          database: process.env.DB_LOGIN_REQUIREMENT_DATABASE,
          url: process.env.DB_LOGIN_REQUIREMENT_URL,
        },
        operationRecord: {
          schema: process.env.DB_OPERATION_RECORD_SCHEMA,
          host: process.env.DB_OPERATION_RECORD_HOST,
          port: parseInt(process.env.DB_OPERATION_RECORD_PORT, 10),
          user: process.env.DB_OPERATION_RECORD_OPERATION_RECORD,
          password: process.env.DB_OPERATION_RECORD_PASSWORD,
          database: process.env.DB_OPERATION_RECORD_DATABASE,
          url: process.env.DB_OPERATION_RECORD_URL,
        },
      },
    };
  },
};
