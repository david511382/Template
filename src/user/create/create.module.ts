import { Module } from '@nestjs/common';
import { infraImports, serviceImports } from './create-module-options.const';
import { ICreateStorageServiceType } from './interface/create-storage.interface';
import { CreateStorageDbAdp } from './create-storage-db.adp';
import { commonProviders } from '../common.provider';
import { CreateService } from './create.service';
import { ICreateServiceType } from '../interface/create-service.interface';

@Module({
  imports: [...infraImports, ...serviceImports],
  providers: [
    ...commonProviders,
    {
      provide: ICreateStorageServiceType,
      useClass: CreateStorageDbAdp,
    },
    {
      provide: ICreateServiceType,
      useClass: CreateService,
    },
  ],
  exports: [ICreateServiceType],
})
export class CreateModule {}
