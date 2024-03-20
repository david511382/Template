import { Module } from '@nestjs/common';
import { DbService } from './db.service';
import { UserDbService } from './user-db.service';
import { OperationRecordDbService } from './operation-record-db.service';

@Module({
  imports: [],
  providers: [DbService,UserDbService,OperationRecordDbService],
  exports: [DbService,UserDbService,OperationRecordDbService],
})
export class DbModule { }
