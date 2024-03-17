import { Prisma } from '@prisma/client';
import { Response } from '../../common/response';
import { QueryableOperationRecordDto } from '../dto/queryable-operation-record.dto';
import { OperationRecord } from '../entities/operation-record.entity';

export interface IOperationRecordStorageService {
  createAsync(
    dto: Prisma.operation_recordCreateInput,
  ): Promise<Response<OperationRecord>>;
  findAsync(
    dto: QueryableOperationRecordDto,
  ): Promise<Response<OperationRecord[]>>;
}

export const IOperationRecordStorageServiceType = Symbol(
  'IOperationRecordStorageService',
);
