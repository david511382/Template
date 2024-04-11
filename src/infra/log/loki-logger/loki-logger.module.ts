import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LokiParseFactory } from './loki-parser-factory';
import { ILogRepoType } from '../interface/parser-factory.interface';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: ILogRepoType,
      useClass: LokiParseFactory,
    },
  ],
  exports: [ILogRepoType],
})
export class LokiLoggerModule { }
