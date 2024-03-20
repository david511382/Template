import { Prisma } from '@prisma/client';
import { Response } from '../../common/entities/response.entity';
import { OperationRecordDo } from '../do/operation-record.do';

export interface IOperationRecordStorageService {
  createAsync(
    dto: Prisma.operation_recordCreateInput,
  ): Promise<Response<OperationRecordDo>>;
}

export const IOperationRecordStorageServiceType = Symbol(
  'IOperationRecordStorageService',
);
