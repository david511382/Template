import { Global, Module } from '@nestjs/common';
import { ILoggerServiceType, IRequestLoggerServiceType } from './interface/logger.interface';
import { ConfigModule } from '@nestjs/config';
import { LogService } from './log.service';
import { RequestLogService } from './request-log.service';

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
  ],
  exports: [ILoggerServiceType, IRequestLoggerServiceType],
})
export class LogModule { }
