import { Module } from '@nestjs/common';
import { SetStorageAdp } from './set-storage.adp';
import { ISetStorageServiceType } from '../interface/set-storage-service.interface';
import { ISetEventServiceType } from '../interface/set-event-service.interface';
import { HttpCronEventAdp } from './http-cron-event.adp';
import { infraImports, serviceImports } from './set-adp-module-options.const';
import { LoginRequirementFactory } from '../login-requirement-factory';

@Module({
  imports: [...infraImports, ...serviceImports],
  providers: [
    LoginRequirementFactory,
    {
      provide: ISetStorageServiceType,
      useClass: SetStorageAdp,
    },
    {
      provide: ISetEventServiceType,
      useClass: HttpCronEventAdp,
    },
  ],
  exports: [ISetStorageServiceType, ISetEventServiceType],
})
export class SetModule {}
