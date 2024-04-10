import { Inject, Injectable, } from '@nestjs/common';
import {
  createLogger,
  transports,
  format,
  LoggerOptions,
} from 'winston';
import { LEVELS, LOG_COLORS } from '../enum/log-level.enum';
import { IConfig, IConfigType } from '../../../config/interface/config.interface';
import DailyRotateFile = require('winston-daily-rotate-file');
import { IParserFactory, ParserFn } from '../interface/parser-factory.interface';
import { ParserDto } from '../dto/parser.dto';

@Injectable()
export class FileLoggerService implements IParserFactory {
  constructor(@Inject(IConfigType) private readonly _config: IConfig) {
  }

  create(meta: Record<string, string>): ParserFn {
    const options = this.getLoggerOptions(this._config);
    options.defaultMeta = meta;
    const logger = createLogger(options);

    return (dto: ParserDto) => {
      dto.msgs.forEach(({ level, msg, optionalParams }) => {
        logger.log(level, msg, ...optionalParams);
      })
    };
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
                return `${config.tz} ${new Date().toLocaleString('GMT', { timeZone: config.tz, hour12: false })}`;
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
      defaultMeta: {},
      exitOnError: false,
    };
  }
}
