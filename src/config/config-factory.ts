import { Injectable } from '@nestjs/common';
import { LogLevelNameEnum } from '../infra/log/enum/log-level.enum';
import { EnvEnum } from './enum/env.enum';
import { IConfigFactory } from './interface/config-factory.interface';
import { IConfig } from './interface/config.interface';
import { getEnumKeyByValue } from '../infra/util/enum-util';

@Injectable()
export class ConfigFactory implements IConfigFactory {
  create(): IConfig {
    return {
      env:
        EnvEnum[getEnumKeyByValue(EnvEnum, process.env.APP_ENV)] ||
        EnvEnum.Prod,
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
      auth: {
        jwtKey: process.env.AUTH_JWT_KEY,
        verifyUrl: process.env.AUTH_VERIFY_URL,
        forgetPswUrl: process.env.AUTH_FORGET_PSW_URL,
        signupResendMailTimeoutSec:
          parseInt(process.env.AUTH_SIGNUP_RESEND_MAIL_TIMEOUT_SEC, 10) || 5,
        forgetPswResendMailTimeoutMin:
          parseInt(process.env.AUTH_FORGET_PSW_RESEND_MAIL_TIMEOUT_MIN, 10) ||
          1,
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
          level:
            LogLevelNameEnum[
              getEnumKeyByValue(LogLevelNameEnum, process.env.LOG_CONSOLE_LEVEL)
            ] || LogLevelNameEnum.Debug,
        },
        file: {
          level:
            LogLevelNameEnum[
              getEnumKeyByValue(LogLevelNameEnum, process.env.LOG_FILE_LEVEL)
            ] || LogLevelNameEnum.Debug,
          filename: process.env.LOG_FILE_FILENAME || '%DATE%.log',
          dirname: process.env.LOG_FILE_DIRNAME || 'logs',
          maxfiles: process.env.LOG_FILE_MAXFILES || '31d',
        },
      },
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10),
        password: process.env.REDIS_PASSWORD,
      },
      db: {
        user: {
          schema: process.env.DB_USER_SCHEMA,
          host: process.env.DB_USER_HOST,
          port: parseInt(process.env.DB_USER_PORT, 10),
          user: process.env.DB_USER_USER,
          password: process.env.DB_USER_PASSWORD,
          database: process.env.DB_USER_DATABASE,
          url: process.env.DB_USER_URL,
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
      email: {
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT, 10),
        username: process.env.EMAIL_USERNAME,
        password: process.env.EMAIL_PASSWORD,
        from: process.env.EMAIL_FROM,
      },
    };
  }
}
