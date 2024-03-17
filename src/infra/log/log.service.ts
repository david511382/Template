import { Inject, Injectable, LogLevel, LoggerService } from '@nestjs/common';
import {
  createLogger,
  transports,
  format,
  Logger,
  LoggerOptions,
} from 'winston';
import { LEVELS, LOG_COLORS, LogLevelNameEnum } from './enum/log-level.enum';
import { IConfig, IConfigType } from '../../config/interface/config.interface';
import DailyRotateFile = require('winston-daily-rotate-file');

@Injectable()
export class LogService implements LoggerService {
  protected readonly logger: Logger;

  constructor(@Inject(IConfigType) config: IConfig) {
    const options = this.getLoggerOptions(config);
    this.logger = createLogger(options);
  }

  logOn(level: LogLevelNameEnum, message: any, ...optionalParams) {
    let msg;
    if (typeof message === 'object') {
      msg =
        message instanceof Error
          ? `${message.name}: ${message.message}`
          : message['message'];

      delete message.message;
      optionalParams.push(message);
    } else {
      msg = message;
    }

    this.logger.log(level.toString(), msg, ...optionalParams);
  }

  log(message: any, ...optionalParams: any[]) {
    this.logOn(LogLevelNameEnum.Info, message, ...optionalParams);
  }
  error(message: any, ...optionalParams: any[]) {
    this.logOn(LogLevelNameEnum.Error, message, ...optionalParams);
  }
  warn(message: any, ...optionalParams: any[]) {
    this.logOn(LogLevelNameEnum.Warn, message, ...optionalParams);
  }
  debug?(message: any, ...optionalParams: any[]) {
    this.logOn(LogLevelNameEnum.Debug, message, ...optionalParams);
  }
  verbose?(message: any, ...optionalParams: any[]) {
    this.logOn(LogLevelNameEnum.Info, message, ...optionalParams);
  }
  fatal?(message: any, ...optionalParams: any[]) {
    this.logOn(LogLevelNameEnum.Fatal, message, ...optionalParams);
  }
  setLogLevels?(levels: LogLevel[]) {
    throw new Error('Method not implemented.');
  }

  protected getLoggerOptions(config: IConfig): LoggerOptions {
    return {
      levels: LEVELS,
      transports: [
        new transports.Console({
          level: config.log.console.level.toString(),
          format: format.combine(
            format.colorize({ colors: LOG_COLORS }),
            format.timestamp({
              format: (): string => {
                return `${config.tz} ${new Date().toLocaleString('GMT', { timeZone: config.tz, hour12: false })}}`;
              },
            }),
            format.printf(({ timestamp, level, message }) => {
              return `[${timestamp}] ${level}: ${message}`;
            }),
          ),
        }),
        new DailyRotateFile({
          format: format.combine(format.timestamp(), format.json()),
          filename: config.log.file.filename,
          dirname: config.log.file.dirname,
          datePattern: 'YYYY-MM-DD', // Rotate every day
          maxSize: '20m',
          maxFiles: config.log.file.maxfiles,
          level: config.log.file.level.toString(),
        }),
      ],
      defaultMeta: {
        service: `${config.appName}`,
      },
      exitOnError: false,
    };
  }
}
