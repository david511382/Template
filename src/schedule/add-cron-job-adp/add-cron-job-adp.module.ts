import { Module } from '@nestjs/common';
import { IAddCronJobHandlerType } from '../interface/add-cron-job-handler.interface';
import { HttpHandlerAdp } from './http-handler.adp';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: IAddCronJobHandlerType,
      useClass: HttpHandlerAdp,
    },
  ],
  exports: [IAddCronJobHandlerType],
})
export class AddCronJobAdpModule {}
