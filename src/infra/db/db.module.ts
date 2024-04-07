import { Module } from '@nestjs/common';
import { UserDbService } from './user-db.service';
import { OperationRecordDbService } from './operation-record-db.service';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [CommonModule],
  providers: [UserDbService, OperationRecordDbService],
  exports: [UserDbService, OperationRecordDbService],
})
export class DbModule { }
