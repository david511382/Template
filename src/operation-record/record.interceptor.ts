import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  LoggerService,
  Inject,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { IS_RECORD_OPERATION } from 'src/infra/http/decorator/public.decorator';
import { OperationRecordService } from './operation-record.service';
import { IRequestLoggerServiceType } from 'src/infra/log/interface/logger.interface';
import { ModuleRef, Reflector } from '@nestjs/core';
import { IResponse } from '../common/interface/response.interface';
import { ErrorCode } from '../common/error/error-code.enum';
import { OperatorCodeEnum } from './enum/operation-record.enum';

@Injectable()
export class TransformInterceptor
  implements NestInterceptor<any, IResponse<any>>
{
  constructor(
    @Inject(IRequestLoggerServiceType) private readonly _logger: LoggerService,
    private readonly _reflector: Reflector,
    private readonly _moduleRef: ModuleRef) { }
  
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IResponse<any>> {
    return next.handle().pipe(
      tap(async (res:IResponse<any>) :Promise<void>  => {
        const recordCode = this._reflector.getAllAndOverride<OperatorCodeEnum>(IS_RECORD_OPERATION, [
          context.getHandler(),
          context.getClass(),
        ]);
        if (!recordCode)return ;
        
        const {user} = context.switchToHttp().getRequest();
        if (!user) return;
        
        const operationRecordService =
        await this._moduleRef.resolve<OperationRecordService>(OperationRecordService);
  
        const createAsyncRes = await operationRecordService.createAsync({
          operatorCode: recordCode,
          message: res.msg,
          operatorEmail: user.email,
        })
        switch (createAsyncRes.errorCode) {
          case ErrorCode.SUCCESS:
            break;
            default:
            }
      }),
    );
  }
}
