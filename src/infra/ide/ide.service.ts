import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { Response, newResponse } from '../../common/entities/response.entity';
import { IConfig, IConfigType } from '../../config/interface/config.interface';
import { HttpService } from '@nestjs/axios';
import { Observable, firstValueFrom, map, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IRequestLoggerServiceType } from '../log/interface/logger.interface';
import { ErrorCode as IdeErrorCode } from './enum/error-code.enum';
import { ErrorCode } from '../../common/error/error-code.enum';
import { IdeResponseDto } from './dto/ide-response.dto';
import { Agent } from 'https';
import { IdeServiceLoginDto } from '../../auth/dto/ide-service-login.dto';
import { IdeServiceLoginDto as OtpDto } from '../../login/dto/ide-service-login.dto';
import { INativeIdeService } from '../../common/interface/native-ide-service.interface.';
import {
  IHttpLoggerFactory,
  IHttpLoggerFactoryType,
} from '../log/interface/http-logger-factory.interface';
import { AxiosError } from 'axios';

@Injectable()
export class IdeService implements INativeIdeService {
  constructor(
    @Inject(IConfigType) private readonly _config: IConfig,
    @Inject(IRequestLoggerServiceType) private readonly _logger: LoggerService,
    @Inject(IHttpLoggerFactoryType)
    private readonly _httpLoggerFactory: IHttpLoggerFactory,
    private readonly _httpService: HttpService,
  ) { }

  async login(dto: IdeServiceLoginDto): Promise<Response<boolean>> {
    const res = newResponse(false);

    const hosts = this._config.ide.hosts;
    for (let i = 0; i < hosts.length; i++) {
      const host = hosts[i];
      const url = `${this._config.ide.protocol}://${host}:${this._config.ide.port}/login/pushTrigger`;
      const data = {
        application: this._config.appName,
        applicationCredential: this._config.ide.credential,
        name: dto.username,
        credential: dto.psw,
        timeStamp: Math.floor(Date.now() / 1000),
        loginInfo: dto.ip,
      };
      const httpsAgent = new Agent({
        rejectUnauthorized: false,
      });
      const logger = await this._httpLoggerFactory.create({
        method: 'POST',
        path: url,
        req: {
          body: data,
        },
      });
      const postRes = await firstValueFrom(
        this._httpService.post(url, data, { httpsAgent, timeout: 65 * 1000, }).pipe(
          logger.log(),
          map((res) => {
            return newResponse<IdeResponseDto>(res.data);
          }),
          catchError<
            Response<IdeResponseDto>,
            Observable<Response<IdeResponseDto>>
          >((error) => {
            const err = error as AxiosError;
            logger.endResponse(err.response);
            if (err.code === AxiosError.ETIMEDOUT) {
              const res = newResponse<IdeResponseDto>().setMsg(
                ErrorCode.TIMEOUT,
              );
              return of(res);
            } else {
              const res = newResponse<IdeResponseDto>().setMsg(
                ErrorCode.SYSTEM_FAIL,
              );
              return of(res);
            }
          }),
        ),
      );
      switch (postRes.errorCode) {
        case ErrorCode.SUCCESS:
          res.results = postRes.results.errorCode === IdeErrorCode.Success;
          return res;
        case ErrorCode.TIMEOUT:
          res.setMsg(ErrorCode.TIMEOUT);
          break;
        default:
          res.setMsg(ErrorCode.SYSTEM_FAIL);
          break;
      }
    }

    return res;
  }

  async otpLogin(dto: OtpDto): Promise<Response<boolean>> {
    const res = newResponse(false);

    const hosts = this._config.ide.hosts;
    for (let i = 0; i < hosts.length; i++) {
      const host = hosts[i];
      const url = `${this._config.ide.protocol}://${host}:${this._config.ide.port}/login/otpTwoFac`;
      const data = {
        application: this._config.appName,
        applicationCredential: this._config.ide.credential,
        name: dto.username,
        credential: dto.otp,
        secondCredential: dto.psw,
        timeStamp: Math.floor(Date.now() / 1000),
        loginInfo: dto.ip,
      };
      const httpsAgent = new Agent({
        rejectUnauthorized: false,
      });
      const requestConfig = {
        httpsAgent,
        timeout: 65 * 1000,
      }
      const logger = await this._httpLoggerFactory.create({
        method: 'POST',
        path: url,
        req: {
          body: data,
        },
      });
      const postRes = await firstValueFrom(
        this._httpService.post(url, data, requestConfig).pipe(
          logger.log(),
          map((res) => {
            return newResponse<IdeResponseDto>(res.data);
          }),
          catchError<
            Response<IdeResponseDto>,
            Observable<Response<IdeResponseDto>>
          >((error) => {
            const err = error as AxiosError;
            logger.endResponse(err.response);
            if (err.code === AxiosError.ETIMEDOUT) {
              const res = newResponse<IdeResponseDto>().setMsg(
                ErrorCode.TIMEOUT,
              );
              return of(res);
            } else {
              const res = newResponse<IdeResponseDto>().setMsg(
                ErrorCode.SYSTEM_FAIL,
              );
              return of(res);
            }
          }),
        ),
      );
      switch (postRes.errorCode) {
        case ErrorCode.SUCCESS:
          res.results = postRes.results.errorCode === IdeErrorCode.Success;
          return res;
        case ErrorCode.TIMEOUT:
          res.setMsg(ErrorCode.TIMEOUT);
          break;
        default:
          res.setMsg(ErrorCode.SYSTEM_FAIL);
          break;
      }
    }

    return res;
  }
}
