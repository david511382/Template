import { Module } from '@nestjs/common';
import { OperationRecordService } from './operation-record.service';
import { OperationRecordController } from './operation-record.controller';
import {
  infraImports,
  serviceImports,
  adpImports,
} from './operation-record-module-options.const';

@Module({
  imports: [...infraImports, ...serviceImports, ...adpImports],
  controllers: [OperationRecordController],
  providers: [OperationRecordService],
})
export class OperationRecordModule {}
