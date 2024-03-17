import { Global, Module } from '@nestjs/common';
import configurationProvider from './configuration.provider';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import configModuleOptions from './config-module-options.const';
import { IConfigType } from './interface/config.interface';

@Global()
@Module({
  imports: [NestConfigModule.forRoot(configModuleOptions)],
  providers: [configurationProvider],
  exports: [IConfigType],
})
export class ConfigModule {}
