import { Module } from '@nestjs/common';
import { infraImports, serviceImports } from './is-exist-module-options.const';
import { IsExistStorageDbAdp } from './is-exist-storage-db.adp';
import { IIsExistStorageServiceType } from './interface/is-exist-storage.interface';
import { IsExistService } from './is-exist.service';
import { IIsExistServiceType } from '../interface/is-exist-service.interface';

@Module({
  imports: [...infraImports, ...serviceImports],
  providers: [
    {
      provide: IIsExistStorageServiceType,
      useClass: IsExistStorageDbAdp,
    },
    {
      provide: IIsExistServiceType,
      useClass: IsExistService,
    },
  ],
  exports: [IIsExistServiceType],
})
export class IsExistModule {}
