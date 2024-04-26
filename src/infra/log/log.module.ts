import { Global, Module } from '@nestjs/common';
import {
  ILoggerServiceType,
  IRequestLoggerServiceType,
} from './interface/logger.interface';
import { ConfigModule } from '@nestjs/config';
import { RequestLogService } from './request-log.service';
import { IHttpLoggerFactoryType } from './interface/http-logger-factory.interface';
import { HttpLoggerFactory } from './http-logger-factory';
import { LoggerService } from './logger.service';
import { RequestIdFactory } from './request-id-factory';
import { ILogRepoType } from './interface/parser-factory.interface';
import { IConfig, IConfigType } from '../../config/interface/config.interface';
import { EnvEnum } from '../../config/enum/env.enum';
import { LokiParseFactory } from './loki-logger/loki-parser-factory';
import { FileParseFactory } from './file-logger/file-parser-factory';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    RequestIdFactory,
    {
      provide: ILogRepoType,
      useFactory: (config: IConfig) => {
        return config.env === EnvEnum.Debug
          ? new LokiParseFactory(config)
          : new FileParseFactory(config);
      },
      inject: [{ token: IConfigType, optional: false }],
    },
    {
      provide: ILoggerServiceType,
      useClass: LoggerService,
    },
    {
      provide: IRequestLoggerServiceType,
      useClass: RequestLogService,
    },
    {
      provide: IHttpLoggerFactoryType,
      useClass: HttpLoggerFactory,
    },
  ],
  exports: [
    ILoggerServiceType,
    IRequestLoggerServiceType,
    IHttpLoggerFactoryType,
  ],
})
export class LogModule {}
