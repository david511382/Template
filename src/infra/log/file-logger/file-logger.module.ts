import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ILoggerServiceType } from '../interface/logger.interface';
import { FileLoggerService } from './file-logger.service';
import { IParserFactoryType } from '../interface/parser-factory.interface';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: IParserFactoryType,
      useClass: FileLoggerService,
    },
  ],
  exports: [
    IParserFactoryType,
  ],
})
export class FileLoggerModule { }
