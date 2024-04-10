import { Inject, Injectable, } from '@nestjs/common';
import {
  createLogger,
  transports,
  format,
  LoggerOptions,
} from 'winston';
import { LEVELS, LOG_COLORS } from '../enum/log-level.enum';
import { IConfig, IConfigType } from '../../../config/interface/config.interface';
import { IParserFactory, ParserFn } from '../interface/parser-factory.interface';
import { ParserDto } from '../dto/parser.dto';
import { HttpService } from '@nestjs/axios';
import { LokiTransport } from './loki-transport';

@Injectable()
export class LokiLoggerService implements IParserFactory {
  constructor(@Inject(IConfigType) private readonly _config: IConfig, private readonly _httpService: HttpService) {
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
        new LokiTransport(
          this._httpService,
          {
            filename: config.log.file.filename,
            dirname: config.log.file.dirname,
            datePattern: 'YYYY-MM-DD', // Rotate every day
            maxSize: '20m',
            maxFiles: config.log.file.maxfiles,
            level: config.log.console.level.toString(),
            format: format.combine(
              format.timestamp({
                format: (): string => {
                  return (new Date().valueOf() * 1000000).toString();
                },
              })
            ),
          }),
      ],
      defaultMeta: {},
      exitOnError: false,
    };
  }
}
