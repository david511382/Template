import { Module } from '@nestjs/common';
import { DbService } from './db.service';
import { OperationRecordStorageService } from './operation-record-storage.service';
import { IOperationRecordStorageServiceType } from '../../operation-record/interface/operation-record-storage.interface';

@Module({
  imports: [],
  providers: [
    DbService,
    {
      provide: IOperationRecordStorageServiceType,
      useClass: OperationRecordStorageService,
    },],
  exports: [IOperationRecordStorageServiceType],
})
export class DbModule { }
