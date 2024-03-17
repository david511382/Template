import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IResponse } from '../interface/response.interface';
import { ErrorCode } from '../error/error-code.enum';
import { instanceToPlain } from 'class-transformer';
import { IS_RECORD_OPERATION } from 'src/infra/http/decorator/public.decorator';
import { OperationRecordService } from './operation-record.service';
import { IRequestLoggerServiceType } from 'src/infra/log/interface/logger.interface';

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
        const recordCode = this._reflector.getAllAndOverride<boolean>(IS_RECORD_OPERATION, [
          context.getHandler(),
          context.getClass(),
        ]);
        if (!recordCode)return ;
        
        const request = context.switchToHttp().getRequest();
        const user = request['user'];
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
