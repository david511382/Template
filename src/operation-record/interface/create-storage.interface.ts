import { Response } from '../../common/response';
import { OperationRecordDo } from '../do/operation-record.do';

export interface ICreateStorageService {
  createAsync(operationRecord: OperationRecordDo): Promise<Response<void>>;
}

export const ICreateStorageServiceType = Symbol('ICreateStorageService');
