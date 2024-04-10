import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { LokiLoggerService } from './loki-logger.service';
import { IParserFactoryType } from '../interface/parser-factory.interface';

@Global()
@Module({
  imports: [ConfigModule, HttpModule],
  providers: [
    {
      provide: IParserFactoryType,
      useClass: LokiLoggerService,
    },
  ],
  exports: [
    IParserFactoryType,
  ],
})
export class LokiLoggerModule { }
