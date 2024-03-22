import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ICreateStorageService } from '../interface/create-storage.interface';
import { Prisma } from '../../../node_modules/.prisma/client/operation_record';
import { ErrorCode } from '../../common/error/error-code.enum';
import { instanceToPlain } from 'class-transformer';
import { OperationRecordDbService } from '../../infra/db/operation-record-db.service';
import { OperationRecordDo } from '../do/operation-record.do';
import { EntityExposeEnum } from '../../common/enum/expose.enum';
import { Response, newResponse } from '../../common/response';
import { ILoggerServiceType } from '../../infra/log/interface/logger.interface';

@Injectable()
export class CreateStorageDbAdp implements ICreateStorageService {
  get operationRecordStorageService() {
    return this._dbService.operation_record;
  }

  constructor(
    @Inject(ILoggerServiceType) private readonly _logger: LoggerService,
    @Inject(OperationRecordDbService)
    private readonly _dbService: OperationRecordDbService,
  ) {}

  async createAsync(
    operationRecord: OperationRecordDo,
  ): Promise<Response<void>> {
    const res = newResponse<void>();

    try {
      const data = instanceToPlain(operationRecord.entity, {
        groups: [EntityExposeEnum.Store],
      }) as Prisma.operation_recordCreateInput;
      await this.operationRecordStorageService.create({ data });
    } catch (e) {
      this._logger.error(e);
      return res.setMsg(ErrorCode.SYSTEM_FAIL);
    }

    return res;
  }
}
