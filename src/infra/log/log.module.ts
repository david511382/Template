import { Global, Module } from '@nestjs/common';
import {
  ILoggerServiceType,
  IRequestLoggerServiceType,
} from './interface/logger.interface';
import { ConfigModule } from '@nestjs/config';
import { RequestLogService } from './request-log.service';
import { IHttpLoggerFactoryType } from './interface/http-logger-factory.interface';
import { HttpLoggerFactory } from './http-logger-factory';
import { LokiLoggerModule } from './loki-logger/loki-logger.module';
import { LoggerService } from './logger.service';

@Global()
@Module({
  imports: [ConfigModule,
    LokiLoggerModule
  ],
  providers: [
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
export class LogModule { }
