import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IResponseDto } from '../interface/response.interface';
import { ErrorCode } from '../error/error-code.enum';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class TransformInterceptor
  implements NestInterceptor<any, IResponseDto<any>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IResponseDto<any>> {
    return next.handle().pipe(
      map((results): IResponseDto<any> => {
        const plain = instanceToPlain(results, {
          excludeExtraneousValues: true,
        });
        return { msg: ErrorCode.SUCCESS, results: plain };
      }),
    );
  }
}
