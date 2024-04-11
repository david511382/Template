import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileParseFactory } from './file-parser-factory';
import { ILogRepoType } from '../interface/parser-factory.interface';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: ILogRepoType,
      useClass: FileParseFactory,
    },
  ],
  exports: [ILogRepoType],
})
export class FileLoggerModule { }
