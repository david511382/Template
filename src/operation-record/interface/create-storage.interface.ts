import { Response } from '../../common/response';
import { OperationRecord } from '../entities/operation-record.entity';

export interface ICreateStorageService {
  createAsync(operationRecord: OperationRecord): Promise<Response<void>>;
}

export const ICreateStorageServiceType = Symbol('ICreateStorageService');
