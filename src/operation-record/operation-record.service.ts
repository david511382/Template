import { Inject, Injectable, Scope } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import {
  ICreateStorageService,
  ICreateStorageServiceType,
} from './interface/create-storage.interface';
import { ErrorCode } from '../common/error/error-code.enum';
import { OperationRecordDo } from './do/operation-record.do';
import { Response, newResponse } from '../common/response';

@Injectable()
export class OperationRecordService {
  constructor(
    @Inject(ICreateStorageServiceType)
    private readonly _createStorageService: ICreateStorageService,
  ) {}

  async createAsync(dto: CreateServiceDto): Promise<Response<void>> {
    const res = newResponse<void>();

    const operationRecord = new OperationRecordDo(dto);

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
