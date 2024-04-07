import { Module } from '@nestjs/common';
import { infraImports, serviceImports } from './find-module-options.const';
import { IFindStorageServiceType } from './interface/find-storage.interface';
import { FindStorageDbAdp } from './find-storage-db.adp';
import { commonProviders } from '../common.provider';
import { IFindServiceType } from '../interface/find-service.interface';
import { FindService } from './find.service';

@Module({
  imports: [...infraImports, ...serviceImports],
  providers: [
    ...commonProviders,
    {
      provide: IFindStorageServiceType,
      useClass: FindStorageDbAdp,
    },
    {
      provide: IFindServiceType,
      useClass: FindService,
    },
  ],
  exports: [IFindStorageServiceType],
})
export class FindModule {}
