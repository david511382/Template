import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { IAddCronJobHandler } from '../interface/add-cron-job-handler.interface';
import { Response, newResponse } from '../../common/response';
import { Agent } from 'https';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map, catchError, Observable, of } from 'rxjs';
import { ErrorCode } from '../../common/error/error-code.enum';
import { AxiosErrorCode } from '../../infra/ide/enum/axios-error-code.enum';
import { InternalTokenType } from '../../app.const';
import { AddCronJobParamsServiceDto } from '../dto/add-cron-job-params-service.dto';
import { IRequestLoggerServiceType } from '../../infra/log/interface/logger.interface';

@Injectable()
export class HttpHandlerAdp implements IAddCronJobHandler {
  constructor(
    @Inject(IRequestLoggerServiceType) private readonly _logger: LoggerService,
    @Inject(InternalTokenType) private readonly INTERNAL_TOKEN: string,
    private readonly _httpService: HttpService,
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
          map((res) => {
            return newResponse<void>();
          }),
          catchError<Response<void>, Observable<Response<void>>>((error) => {
            this._logger.error(error);
            if (error.code === AxiosErrorCode.Timeout) {
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
