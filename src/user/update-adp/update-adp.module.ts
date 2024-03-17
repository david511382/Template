import { Module } from '@nestjs/common';
import {
  infraImports,
  serviceImports,
} from './update-adp-module-options.const';
import { UpdateStorageDbAdp } from './update-storage-db.adp';
import { IUpdateStorageServiceType } from '../interface/update-storage.interface';

@Module({
  imports: [...infraImports, ...serviceImports],
  providers: [
    {
      provide: IUpdateStorageServiceType,
      useClass: UpdateStorageDbAdp,
    },
  ],
  exports: [IUpdateStorageServiceType],
})
export class UpdateAdpModule {}
