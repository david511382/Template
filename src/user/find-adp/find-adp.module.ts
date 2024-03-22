import { Module } from '@nestjs/common';
import { infraImports, serviceImports } from './find-adp-module-options.const';
import { IFindStorageServiceType } from '../interface/find-storage.interface';
import { FindStorageDbAdp } from './find-storage-db.adp';

@Module({
  imports: [...infraImports, ...serviceImports],
  providers: [
    {
      provide: IFindStorageServiceType,
      useClass: FindStorageDbAdp,
    },
  ],
  exports: [IFindStorageServiceType],
})
export class FindAdpModule {}
