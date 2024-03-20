import { Global, Module } from '@nestjs/common';
import configurationProvider from './configuration.provider';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import configModuleOptions from './config-module-options.const';
import {  IConfigType } from './interface/config.interface';
import { IConfigFactoryType } from './interface/config-factory.interface';
import { ConfigFactory } from './config-factory';

@Global()
@Module({
  imports: [NestConfigModule.forRoot(configModuleOptions)],
  providers: [
    {
      provide: IConfigFactoryType,
      useClass: ConfigFactory,
    },
    configurationProvider,
  ],
  exports: [IConfigType],
})
export class ConfigModule {}
