import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { AddCronJobAdpModule } from './add-cron-job-adp/add-cron-job-adp.module';
import { ScheduleModule as InfraScheduleModule } from '@nestjs/schedule';
import { FindModule } from './find/find.module';

@Module({
  imports: [InfraScheduleModule.forRoot(), AddCronJobAdpModule, FindModule],
  controllers: [ScheduleController],
  providers: [ScheduleService],
})
export class ScheduleModule {}
