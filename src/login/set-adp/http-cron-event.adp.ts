import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { LoginRequirement } from '../entities/login-requirement.enetity';
import { newResponse, Response } from '../../common/response';
import { ErrorCode } from '../../common/error/error-code.enum';
import { ISetEventService } from '../interface/set-event-service.interface';
import { HttpService } from '@nestjs/axios';
import { IConfigType, IConfig } from '../../config/interface/config.interface';
import { IRequestLoggerServiceType } from '../../infra/log/interface/logger.interface';
import { Agent } from 'https';
import { firstValueFrom, map, catchError, Observable, of } from 'rxjs';
import { AxiosErrorCode } from '../../infra/ide/enum/axios-error-code.enum';
import { InternalTokenType } from '../../app.const';

@Injectable()
export class HttpCronEventAdp implements ISetEventService {
  constructor(
    @Inject(IConfigType) private readonly _config: IConfig,
    @Inject(IRequestLoggerServiceType) private readonly _logger: LoggerService,
    @Inject(InternalTokenType) private readonly INTERNAL_TOKEN: string,
    private readonly _httpService: HttpService,
  ) {}

  async disableAsync(
    loginRequirement: LoginRequirement,
    endTime: Date,
  ): Promise<Response<void>> {
    const res = newResponse<void>();

    const { http: handlerConfig, cronServer: cronConfig } = this._config;
    const username = loginRequirement.username;
    const name = `disable-${username}`;
    const url = `${cronConfig.protocol}://${cronConfig.host}:${cronConfig.port}/schedule/cronjob/${name}`;
    const data = {
      time: endTime,
      params: {
        url: `${handlerConfig.protocol}://${handlerConfig.host}:${handlerConfig.port}/login/connection/${username}`,
        method: 'delete',
        data: {},
      },
    };
    const headers = {
      Authorization: `Bearer ${this.INTERNAL_TOKEN}`,
    };
    const httpsAgent = new Agent({
      rejectUnauthorized: false,
      timeout: 5 * 1000,
    });
    const postRes = await firstValueFrom(
      this._httpService
        .post(url, data, {
          httpsAgent,
          headers,
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
