import { Module } from '@nestjs/common';
import { infraImports, serviceImports } from './update-module-options.const';
import { UpdateStorageDbAdp } from './update-storage-db.adp';
import { IUpdateStorageServiceType } from './interface/update-storage.interface';
import { IUpdateServiceType } from '../interface/update-service.interface';
import { UpdateService } from './update.service';
import { UpdateController } from './update.controller';

@Module({
  imports: [...infraImports, ...serviceImports],
  providers: [
    {
      provide: IUpdateStorageServiceType,
      useClass: UpdateStorageDbAdp,
    },
    {
      provide: IUpdateServiceType,
      useClass: UpdateService,
    },
  ],
  controllers: [UpdateController],
  exports: [IUpdateServiceType],
})
export class UpdateModule {}
