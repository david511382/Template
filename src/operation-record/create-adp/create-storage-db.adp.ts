import { Inject, Injectable } from '@nestjs/common';
import { ICreateStorageService } from '../interface/create-storage.interface';
import { Response, newResponse } from '../../common/response';
import { OperationRecord } from '../entities/operation-record.entity';
import {
  IOperationRecordStorageService,
  IOperationRecordStorageServiceType,
} from '../interface/operation-record-storage.interface';
import { Prisma } from '@prisma/client';
import { ErrorCode } from '../../common/error/error-code.enum';
import { instanceToPlain, plainToInstance } from 'class-transformer';

@Injectable()
export class CreateStorageDbAdp implements ICreateStorageService {
  constructor(
    @Inject(IOperationRecordStorageServiceType)
    private readonly _operationRecordStorageService: IOperationRecordStorageService,
  ) {}

  async createAsync(operationRecord: OperationRecord): Promise<Response<void>> {
    const res = newResponse<void>();

    const operationRecordData = instanceToPlain(operationRecord, {
      groups: ['store'],
    }) as Prisma.operation_recordCreateInput;

    const createAsyncRes =
      await this._operationRecordStorageService.createAsync(
        operationRecordData,
      );
    switch (createAsyncRes.errorCode) {
      case ErrorCode.SUCCESS:
        break;
      default:
        return res.setMsg(ErrorCode.SYSTEM_FAIL);
    }

    return res;
  }
}
