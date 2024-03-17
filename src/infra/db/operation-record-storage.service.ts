import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { DbService } from './db.service';
import { IOperationRecordStorageService } from '../../operation-record/interface/operation-record-storage.interface';
import { Prisma } from '@prisma/client';
import {
  Response,
  newResponse,
} from '../../common/response';
import { QueryableOperationRecordDto } from '../../operation-record/dto/queryable-operation-record.dto';
import { IRequestLoggerServiceType } from '../log/interface/logger.interface';
import { OperationRecord } from '../../operation-record/entities/operation-record.entity';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { ErrorCode } from '../../common/error/error-code.enum';

@Injectable()
export class OperationRecordStorageService implements IOperationRecordStorageService {
  constructor(
    @Inject(IRequestLoggerServiceType) private readonly _logger: LoggerService,
    private readonly _db: DbService,
  ) { }

  async createAsync(
    dto: Prisma.operation_recordCreateInput,
  ): Promise<Response<OperationRecord>> {
    const res = newResponse<OperationRecord>();

    try {
      const created = await this._db.operation_record.create({ data: dto });
      const plain = instanceToPlain(created);
      res.results = plainToInstance(OperationRecord, plain, {
        groups: ['store'],
      });
    } catch (e) {
      this._logger.error(e);
      res.setMsg(ErrorCode.SYSTEM_FAIL);
    } finally {
      return res;
    }
  }

  findAsync(
    dto: QueryableOperationRecordDto,
  ): Promise<Response<OperationRecord[]>> {
    throw new Error('Method not implemented.');
  }
}
