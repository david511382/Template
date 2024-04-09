import { Module } from '@nestjs/common';
import { infraImports, serviceImports } from './get-adp-module-options.const';
import { IGetStorageServiceType } from '../interface/get-storage-service.interface';
import { GetStorageDbAdp } from './get-storage-db.adp';
import { LoginRequirementFactory } from '../login-requirement-factory';

@Module({
  imports: [...infraImports, ...serviceImports],
  providers: [
    LoginRequirementFactory,
    {
      provide: IGetStorageServiceType,
      useClass: GetStorageDbAdp,
    },
  ],
  exports: [IGetStorageServiceType],
})
export class GetAdpModule {}
