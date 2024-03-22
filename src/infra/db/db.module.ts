import { Module } from '@nestjs/common';
import { UserDbService } from './user-db.service';
import { OperationRecordDbService } from './operation-record-db.service';

@Module({
  imports: [],
  providers: [UserDbService, OperationRecordDbService],
  exports: [UserDbService, OperationRecordDbService],
})
export class DbModule {}
