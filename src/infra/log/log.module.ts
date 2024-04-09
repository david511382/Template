import { Global, Module } from '@nestjs/common';
import {
  ILoggerServiceType,
  IRequestLoggerServiceType,
} from './interface/logger.interface';
import { ConfigModule } from '@nestjs/config';
import { LogService } from './log.service';
import { RequestLogService } from './request-log.service';
import { IHttpLoggerFactoryType } from './interface/http-logger-factory.interface';
import { HttpLoggerFactory } from './http-logger-factory';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: ILoggerServiceType,
      useClass: LogService,
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
