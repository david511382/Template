import { Inject, Injectable } from '@nestjs/common';
import { ICreateStorageService } from '../interface/create-storage.interface';
import { Response, newResponse } from '../../common/entities/response.entity';
import { Prisma } from '@prisma/client';
import { ErrorCode } from '../../common/error/error-code.enum';
import { instanceToPlain } from 'class-transformer';
import { RequestLoggerTemplate } from '../../common/request-logger-template';
import { ModuleRef } from '@nestjs/core';
import { OperationRecordDbService } from '../../infra/db/operation-record-db.service';
import { OperationRecordDo } from '../do/operation-record.do';
import { IOperationRecordStorageServiceType } from '../interface/operation-record-storage.interface';
import { EntityExposeEnum } from '../../common/enum/expose.enum';

@Injectable()
export class CreateStorageDbAdp
  extends RequestLoggerTemplate
  implements ICreateStorageService {
  get operationRecordStorageService() {
    return this._dbService.operation_record;
  }

  constructor(
    moduleRef: ModuleRef,
    @Inject(IOperationRecordStorageServiceType)
    @Inject(OperationRecordDbService)
    private readonly _dbService: OperationRecordDbService,
  ) {
    super(moduleRef);
  }

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
      super.logger.error(e);
      return res.setMsg(ErrorCode.SYSTEM_FAIL);
    }

    return res;
  }
}
