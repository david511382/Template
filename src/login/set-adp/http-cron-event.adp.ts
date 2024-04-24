import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { LoginRequirementDo } from '../do/login-requirement.do';
import { newResponse, Response } from '../../common/entities/response.entity';
import { ErrorCode } from '../../common/error/error-code.enum';
import { ISetEventService } from '../interface/set-event-service.interface';
import { HttpService } from '@nestjs/axios';
import { IConfigType, IConfig } from '../../config/interface/config.interface';
import { IRequestLoggerServiceType } from '../../infra/log/interface/logger.interface';
import { Agent } from 'https';
import { firstValueFrom, map, catchError, Observable, of } from 'rxjs';
import { InternalTokenType } from '../../app.const';
import {
  IHttpLoggerFactoryType,
  IHttpLoggerFactory,
} from '../../infra/log/interface/http-logger-factory.interface';
import { AxiosError } from 'axios';

@Injectable()
export class HttpCronEventAdp implements ISetEventService {
  private static getCronName(
    loginRequirement: LoginRequirementDo,
    enable: boolean,
  ): string {
    return enable
      ? `enable-${loginRequirement.id}`
      : `disable-${loginRequirement.id}`;
  }

  constructor(
    @Inject(IConfigType) private readonly _config: IConfig,
    @Inject(IRequestLoggerServiceType) private readonly _logger: LoggerService,
    @Inject(InternalTokenType) private readonly INTERNAL_TOKEN: string,
    private readonly _httpService: HttpService,
    @Inject(IHttpLoggerFactoryType)
    private readonly _httpLoggerFactory: IHttpLoggerFactory,
  ) {}

  async enableAsync(
    loginRequirement: LoginRequirementDo,
  ): Promise<Response<void>> {
    const res = newResponse<void>();

    const { http: handlerConfig } = this._config;
    const id = loginRequirement.id;
    const name = HttpCronEventAdp.getCronName(loginRequirement, true);
    const data = {
      time: loginRequirement.connectTime,
      params: {
        url: `${handlerConfig.protocol}://${handlerConfig.host}:${handlerConfig.port}/login/connection/${id}`,
        method: 'post',
        data: {},
      },
    };
    return await this.createCronjobAsync(name, data);
  }

  async disableAsync(
    loginRequirement: LoginRequirementDo,
    endTime: Date,
  ): Promise<Response<void>> {
    const res = newResponse<void>();

    const { http: handlerConfig } = this._config;
    const id = loginRequirement.id;
    const name = HttpCronEventAdp.getCronName(loginRequirement, false);
    const data = {
      time: endTime,
      params: {
        url: `${handlerConfig.protocol}://${handlerConfig.host}:${handlerConfig.port}/login/connection/${id}`,
        method: 'delete',
        data: {},
      },
    };
    return await this.createCronjobAsync(name, data);
  }

  async createCronjobAsync(name: string, data): Promise<Response<void>> {
    const res = newResponse<void>();

    const { cronServer: cronConfig } = this._config;
    const url = `${cronConfig.protocol}://${cronConfig.host}:${cronConfig.port}/schedule/cronjob/${name}`;
    const headers = {
      Authorization: `Bearer ${this.INTERNAL_TOKEN}`,
    };
    const httpsAgent = new Agent({
      rejectUnauthorized: false,
      timeout: 5 * 1000,
    });
    const logger = await this._httpLoggerFactory.create({
      method: 'POST',
      path: url,
      req: {
        body: data,
      },
    });
    const postRes = await firstValueFrom(
      this._httpService
        .post(url, data, {
          httpsAgent,
          headers,
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
            } else if (err.code === AxiosError.ERR_BAD_REQUEST) {
              if (err.response.data['msg'] === ErrorCode.PAST_DATE) {
                const res = newResponse<void>().setMsg(ErrorCode.PAST_DATE);
                return of(res);
              } else if (err.response.data['msg'] === ErrorCode.EXISTING) {
                const res = newResponse<void>().setMsg(ErrorCode.EXISTING);
                return of(res);
              } else {
                const res = newResponse<void>().setMsg(ErrorCode.WRONG_INPUT);
                return of(res);
              }
            } else {
              const res = newResponse<void>().setMsg(ErrorCode.SYSTEM_FAIL);
              return of(res);
            }
          }),
        ),
    );
    switch (postRes.errorCode) {
      case ErrorCode.SUCCESS:
        break;
      default:
        res.setMsg(postRes.errorCode);
        break;
    }

    return res;
  }

  async cancelIfExistAsync(
    loginRequirement: LoginRequirementDo,
    enable: boolean,
  ): Promise<Response<void>> {
    const res = newResponse<void>();

    const { cronServer: cronConfig } = this._config;
    const name = HttpCronEventAdp.getCronName(loginRequirement, enable);
    const url = `${cronConfig.protocol}://${cronConfig.host}:${cronConfig.port}/schedule/cronjob/${name}`;
    const method = 'delete';
    const data = {};
    const headers = {
      Authorization: `Bearer ${this.INTERNAL_TOKEN}`,
    };
    const httpsAgent = new Agent({
      rejectUnauthorized: false,
      timeout: 5 * 1000,
    });
    const logger = await this._httpLoggerFactory.create({
      method,
      path: url,
      req: {
        body: data,
      },
    });
    const requestRes = await firstValueFrom(
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
            } else if (err.response.status === 404) {
              const res = newResponse<void>();
              return of(res);
            } else {
              const res = newResponse<void>().setMsg(ErrorCode.SYSTEM_FAIL);
              return of(res);
            }
          }),
        ),
    );
    switch (requestRes.errorCode) {
      case ErrorCode.SUCCESS:
        break;
      default:
        res.setMsg(requestRes.errorCode);
        break;
    }

    return res;
  }
}
