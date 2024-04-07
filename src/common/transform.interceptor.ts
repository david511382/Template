import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IResponse } from './interface/response.interface';
import { ErrorCode } from './error/error-code.enum';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class TransformInterceptor
  implements NestInterceptor<any, IResponse<any>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IResponse<any>> {
    return next.handle().pipe(
      map((results): IResponse<any> => {
        const plain = instanceToPlain(results);
        return { msg: ErrorCode.SUCCESS, results: plain };
      }),
    );
  }
}
