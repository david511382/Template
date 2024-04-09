import { Module } from '@nestjs/common';
import { FindService } from './find.service';
import { FindController } from './find.controller';
import { ScheduleModule as InfraScheduleModule } from '@nestjs/schedule';
import { IFindServiceType } from '../interface/find-service.interface';

@Module({
  imports: [InfraScheduleModule.forRoot()],
  controllers: [FindController],
  providers: [
    {
      provide: IFindServiceType,
      useClass: FindService,
    },
  ],
  exports: [IFindServiceType],
})
export class FindModule {}
