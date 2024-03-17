import { Module } from '@nestjs/common';
import {
  infraImports,
  serviceImports,
} from './create-adp-module-options.const';
import { ICreateStorageServiceType } from '../interface/create-storage.interface';
import { CreateStorageDbAdp } from './create-storage-db.adp';

@Module({
  imports: [...infraImports, ...serviceImports],
  providers: [
    {
      provide: ICreateStorageServiceType,
      useClass: CreateStorageDbAdp,
    },
  ],
  exports: [ICreateStorageServiceType],
})
export class CreateAdpModule {}
