import { Module } from '@nestjs/common';
import { LogModule } from '../log/log.module';
import { OperationRecordDbService } from './operation-record-db.service';
import { LoginRequirementDbService } from './login-requirement-db.service';

@Module({
  imports: [LogModule],
  providers: [OperationRecordDbService, LoginRequirementDbService],
  exports: [OperationRecordDbService, LoginRequirementDbService],
})
export class DbModule {}
