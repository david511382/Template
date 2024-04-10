import { Inject, Injectable, } from '@nestjs/common';
import {
  createLogger,
  transports,
  format,
  LoggerOptions,
} from 'winston';
import { HttpService } from '@nestjs/axios';
import * as Transport from 'winston-transport';
import { IConfigType, IConfig } from '../../config/interface/config.interface';
import { ParserDto } from './dto/parser.dto';
import { LOG_COLORS, LEVELS } from './enum/log-level.enum';
import { IParserFactory, ParserFn } from './interface/parser-factory.interface';


export class LokiTransport extends transports.Console {
  constructor(private readonly _httpService: HttpService, opts) {
    super({
      level: this._config.log.console.level.toString(),
      format: format.combine(
        format.colorize({ colors: LOG_COLORS }),
        format.timestamp({
          format: (): string => {
            return `${this._config.tz} ${new Date().toLocaleString('GMT', { timeZone: this._config.tz, hour12: false })}`;
          },
        }),
        format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] ${level}: ${message}`;
        }),
      ),
    });
  }
};

@Injectable()
export class WinstonLoggerService implements IParserFactory {
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

  protected getTransports(): Transport[] {
    return [new transports.Console({
      level: this._config.log.console.level.toString(),
      format: format.combine(
        format.colorize({ colors: LOG_COLORS }),
        format.timestamp({
          format: (): string => {
            return `${this._config.tz} ${new Date().toLocaleString('GMT', { timeZone: this._config.tz, hour12: false })}`;
          },
        }),
        format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] ${level}: ${message}`;
        }),
      ),
    })]
  }

  private getLoggerOptions(config: IConfig): LoggerOptions {
    return {
      levels: LEVELS,
      transports: this.getTransports(),
      defaultMeta: {},
      exitOnError: false,
    };
  }
}
