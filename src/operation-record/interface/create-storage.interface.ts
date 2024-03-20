import { Response } from '../../common/entities/response.entity';
import { OperationRecordDo } from '../do/operation-record.do';

export interface ICreateStorageService {
  createAsync(operationRecord: OperationRecordDo): Promise<Response<void>>;
}

export const ICreateStorageServiceType = Symbol('ICreateStorageService');
