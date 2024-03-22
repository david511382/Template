import { Module } from '@nestjs/common';
import {
  infraImports,
  serviceImports,
} from './is-exist-adp-module-options.const';
import { IsExistStorageDbAdp } from './is-exist-storage-db.adp';
import { IIsExistStorageServiceType } from '../interface/is-exist-storage.interface';

@Module({
  imports: [...infraImports, ...serviceImports],
  providers: [
    {
      provide: IIsExistStorageServiceType,
      useClass: IsExistStorageDbAdp,
    },
  ],
  exports: [IIsExistStorageServiceType],
})
export class IsExistAdpModule {}
