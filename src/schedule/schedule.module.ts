import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { AddCronJobAdpModule } from './add-cron-job-adp/add-cron-job-adp.module';
import { ScheduleModule as InfraScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [InfraScheduleModule.forRoot(), AddCronJobAdpModule],
  controllers: [ScheduleController],
  providers: [ScheduleService],
})
export class ScheduleModule {}
