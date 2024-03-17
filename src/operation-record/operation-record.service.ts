import { Inject, Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import {
  ICreateStorageService,
  ICreateStorageServiceType,
} from './interface/create-storage.interface';
import { Response, newResponse } from '../common/response';
import { OperationRecord } from './entities/operation-record.entity';
import { ErrorCode } from '../common/error/error-code.enum';

@Injectable()
export class OperationRecordService {
  constructor(
    @Inject(ICreateStorageServiceType)
    private readonly _createStorageService: ICreateStorageService,
  ) {}

  async createAsync(dto: CreateServiceDto): Promise<Response<void>> {
    const res = newResponse<void>();

    const operationRecord = new OperationRecord(dto);

    const createAsyncRes =
      await this._createStorageService.createAsync(operationRecord);
    switch (createAsyncRes.errorCode) {
      case ErrorCode.SUCCESS:
        break;
      default:
        return res.setMsg(ErrorCode.SYSTEM_FAIL);
    }

    return res;
  }
}
