import { Prisma } from '../../../node_modules/.prisma/client/operation_record';
import { OperationRecordDo } from '../do/operation-record.do';
import { Response } from '../../common/response';

export interface IOperationRecordStorageService {
  createAsync(
    dto: Prisma.operation_recordCreateInput,
  ): Promise<Response<OperationRecordDo>>;
}

export const IOperationRecordStorageServiceType = Symbol(
  'IOperationRecordStorageService',
);
