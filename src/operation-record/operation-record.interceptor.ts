import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Metadata } from 'src/infra/http/metadata';
import { OperationRecordService } from './operation-record.service';
import { ModuleRef, Reflector } from '@nestjs/core';
import { OperatorCodeEnum } from './enum/operation-record.enum';
import { ErrorCode } from '../common/error/error-code.enum';
import { RequestLoggerTemplate } from '../common/request-logger-template';
import { IResponse } from '../common/interface/response.interface';

@Injectable()
export class OperationRecordInterceptor
  extends RequestLoggerTemplate
  implements NestInterceptor<any, IResponse<any>>
{
  constructor(
    private readonly _reflector: Reflector,
    moduleRef: ModuleRef,
  ) {
    super(moduleRef);
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IResponse<any>> {
    return next.handle().pipe(
      tap(async (res: IResponse<any>): Promise<void> => {
        const recordCode = this._reflector.getAllAndOverride<OperatorCodeEnum>(
          Metadata.RecordOperation,
          [context.getHandler(), context.getClass()],
        );
        if (!recordCode) return;

        const request = context.switchToHttp().getRequest();
        const user = request['user'];
        if (!user) {
          super.logger.error(`No User In Operation Record Code:${recordCode}`);
          return;
        }

        const operationRecordService =
          await this._moduleRef.get<OperationRecordService>(
            OperationRecordService,
            { strict: false },
          );

        const createAsyncRes = await operationRecordService.createAsync({
          operatorCode: recordCode,
          message: res.msg,
          username: user.username,
          operatorTime: new Date(),
        });
        switch (createAsyncRes.errorCode) {
          case ErrorCode.SUCCESS:
            break;
          default:
        }
      }),
    );
  }
}
