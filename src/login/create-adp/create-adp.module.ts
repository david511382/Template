import { Module } from '@nestjs/common';
import {
  infraImports,
  serviceImports,
} from './create-adp-module-options.const';
import { CreateStorageDbAdp } from './create-storage-db.adp';
import { ICreateStorageServiceType } from '../interface/create-storage-service.interface';
import { LoginRequirementFactory } from '../login-requirement-factory';

@Module({
  imports: [...infraImports, ...serviceImports],
  providers: [
    LoginRequirementFactory,
    {
      provide: ICreateStorageServiceType,
      useClass: CreateStorageDbAdp,
    },
  ],
  exports: [ICreateStorageServiceType],
})
export class CreateAdpModule {}
