import { Inject, Injectable } from '@nestjs/common';
import { createLogger, LoggerOptions, transport } from 'winston';
import { IConfigType, IConfig } from '../../config/interface/config.interface';
import { CreateDto } from './dto/create.dto';
import { LEVELS } from './enum/log-level.enum';
import { ILogRepo } from './interface/parser-factory.interface';
import { ConsoleTransport } from './console-transport';

@Injectable()
export class WinstonParseFactory implements ILogRepo {
  private readonly logger;

  constructor(@Inject(IConfigType) protected readonly config: IConfig) {
    const options = this.getLoggerOptions(this.config);
    this.logger = createLogger(options);
  }

  create({ level, msg, optionalParams }: CreateDto) {
    this.logger.log(level, msg, optionalParams);
  }

  protected getTransports(): transport[] {
    return [new ConsoleTransport(this.config)];
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
