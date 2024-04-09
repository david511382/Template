import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { IAddCronJobHandler } from '../interface/add-cron-job-handler.interface';
import { Response, newResponse } from '../../common/entities/response.entity';
import { Agent } from 'https';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map, catchError, Observable, of } from 'rxjs';
import { ErrorCode } from '../../common/error/error-code.enum';
import { InternalTokenType } from '../../app.const';
import { AddCronJobParamsServiceDto } from '../dto/add-cron-job-params-service.dto';
import { IRequestLoggerServiceType } from '../../infra/log/interface/logger.interface';
import { AxiosError } from 'axios';
import {
  IHttpLoggerFactoryType,
  IHttpLoggerFactory,
} from '../../infra/log/interface/http-logger-factory.interface';

@Injectable()
export class HttpHandlerAdp implements IAddCronJobHandler {
  constructor(
    @Inject(IRequestLoggerServiceType) private readonly _logger: LoggerService,
    @Inject(InternalTokenType) private readonly INTERNAL_TOKEN: string,
    private readonly _httpService: HttpService,
    @Inject(IHttpLoggerFactoryType)
    private readonly _httpLoggerFactory: IHttpLoggerFactory,
  ) {}

  async execAsync(params: AddCronJobParamsServiceDto): Promise<Response<void>> {
    const res = newResponse<void>();

    const { url, data, method } = params;
    const headers = {
      Authorization: `Bearer ${this.INTERNAL_TOKEN}`,
    };
    const httpsAgent = new Agent({
      rejectUnauthorized: false,
      timeout: 60 * 1000,
    });
    const logger = await this._httpLoggerFactory.create({
      method,
      path: url,
      req: {
        body: data,
      },
    });
    const postRes = await firstValueFrom(
      this._httpService
        .request({
          method,
          data,
          headers,
          url,
          httpsAgent,
        })
        .pipe(
          logger.log(),
          map((res) => {
            return newResponse<void>();
          }),
          catchError<Response<void>, Observable<Response<void>>>((error) => {
            const err = error as AxiosError;
            logger.endResponse(err.response);
            if (err.code === AxiosError.ETIMEDOUT) {
              const res = newResponse<void>().setMsg(ErrorCode.TIMEOUT);
              return of(res);
            } else {
              const res = newResponse<void>().setMsg(ErrorCode.SYSTEM_FAIL);
              return of(res);
            }
          }),
        ),
    );
    switch (postRes.errorCode) {
      case ErrorCode.SUCCESS:
        return res;
      case ErrorCode.TIMEOUT:
        res.setMsg(ErrorCode.TIMEOUT);
        break;
      default:
        res.setMsg(ErrorCode.SYSTEM_FAIL);
        break;
    }

    return res;
  }
}
