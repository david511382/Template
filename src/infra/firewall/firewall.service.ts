import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { Response, newResponse } from '../../common/entities/response.entity';
import { IFirewallService } from '../../login/interface/firewall-service.interface';
import { HttpService } from '@nestjs/axios';
import { Agent } from 'https';
import { firstValueFrom, map, catchError, Observable, of, tap } from 'rxjs';
import { IConfigType, IConfig } from '../../config/interface/config.interface';
import { IRequestLoggerServiceType } from '../log/interface/logger.interface';
import { ConfigResponseDto } from './dto/config-response.dto';
import { ErrorCode } from '../../common/error/error-code.enum';
import { ErrorCode as FirewallErrorCode } from './enum/error-code.enum';
import { CommitResponseDto } from './dto/commit-response.dto';
import {
  IHttpLoggerFactory,
  IHttpLoggerFactoryType,
} from '../log/interface/http-logger-factory.interface';
import { AxiosError } from 'axios';
const htmlparser = require('htmlparser');

@Injectable()
export class FirewallService implements IFirewallService {
  constructor(
    @Inject(IConfigType) private readonly _config: IConfig,
    @Inject(IRequestLoggerServiceType) private readonly _logger: LoggerService,
    @Inject(IHttpLoggerFactoryType)
    private readonly _httpLoggerFactory: IHttpLoggerFactory,
    private readonly _httpService: HttpService,
  ) {}

  async configAsync(
    username: string,
    enable: boolean,
  ): Promise<Response<void>> {
    const res = newResponse<void>();

    try {
      const { firewall: firewallConfig } = this._config;
      const hosts = firewallConfig.hosts;
      const disabled = enable ? 'no' : 'yes';
      for (let i = 0; i < hosts.length; i++) {
        const host = hosts[i];
        const query = {
          key: firewallConfig.credential,
          type: 'config',
          action: 'set',
          xpath: `/config/shared/local-user-database/user/entry[@name='${username}']`,
          element: `<disabled>${disabled}</disabled>`,
        };
        const queryString = new URLSearchParams(query).toString();
        const url = `${firewallConfig.protocol}://${host}:${firewallConfig.port}/api/?${queryString}`;
        const httpsAgent = new Agent({
          rejectUnauthorized: false,
        });
        const requestConfig = {
          httpsAgent,
          timeout: 10 * 1000,
        };
        const logger = await this._httpLoggerFactory.create({
          method: 'GET',
          path: url,
        });
        const getRes = await firstValueFrom(
          this._httpService.get(url, requestConfig).pipe(
            logger.log(),
            map((response) => {
              const res = newResponse<ConfigResponseDto>();

              // <response status="success" code="20"><msg>command succeeded</msg></response>
              const rawHtml = response.data;
              const handler = new htmlparser.DefaultHandler(function (
                error,
                dom,
              ) {
                if (error) throw new Error(error);

                res.results = {
                  status: dom[0].attribs.status,
                  code: dom[0].attribs.code,
                  msg: dom[0].children[0].data,
                };
              });
              const parser = new htmlparser.Parser(handler);
              parser.parseComplete(rawHtml);

              return res;
            }),
            catchError<
              Response<ConfigResponseDto>,
              Observable<Response<ConfigResponseDto>>
            >((error) => {
              const err = error as AxiosError;
              logger.endResponse(err.response);
              if (err.code === AxiosError.ETIMEDOUT) {
                const res = newResponse<ConfigResponseDto>().setMsg(
                  ErrorCode.TIMEOUT,
                );
                return of(res);
              } else {
                const res = newResponse<ConfigResponseDto>().setMsg(
                  ErrorCode.SYSTEM_FAIL,
                );
                return of(res);
              }
            }),
          ),
        );
        switch (getRes.errorCode) {
          case ErrorCode.SUCCESS:
            const success = getRes.results.status === FirewallErrorCode.Success;
            if (!success) res.setMsg(ErrorCode.EXEC_FAIL);
            return res;
          case ErrorCode.TIMEOUT:
            res.setMsg(ErrorCode.TIMEOUT);
            break;
          default:
            res.setMsg(ErrorCode.SYSTEM_FAIL);
            break;
        }
      }
    } catch (err) {
      this._logger.error(err);
      res.setMsg(ErrorCode.SYSTEM_FAIL);
    } finally {
      return res;
    }
  }

  async commitAsync(description: string): Promise<Response<void>> {
    const res = newResponse<void>();

    try {
      const { firewall: firewallConfig } = this._config;
      const hosts = firewallConfig.hosts;
      for (let i = 0; i < hosts.length; i++) {
        const host = hosts[i];
        const query = {
          key: firewallConfig.credential,
          type: 'commit',
          cmd: `<commit><description>${description}</description></commit>`,
        };
        const queryString = new URLSearchParams(query).toString();
        const url = `${firewallConfig.protocol}://${host}:${firewallConfig.port}/api/?${queryString}`;
        const httpsAgent = new Agent({
          rejectUnauthorized: false,
        });
        const requestConfig = {
          httpsAgent,
          timeout: 10 * 1000,
        };
        const logger = await this._httpLoggerFactory.create({
          method: 'GET',
          path: url,
        });
        const getRes = await firstValueFrom(
          this._httpService.get(url, requestConfig).pipe(
            logger.log(),
            map((response) => {
              const res = newResponse<CommitResponseDto>();

              // <response status="success" code="19"><result><msg><line>Commit job enqueued with jobid 150</line></msg><job>150</job></result></response>
              const rawHtml = response.data;
              const handler = new htmlparser.DefaultHandler(function (
                error,
                dom,
              ) {
                if (error) throw new Error(error);

                res.results = {
                  status: dom[0].attribs.status,
                  code: dom[0].attribs.code,
                  msg: dom[0].children[0].children[0].data,
                  job: dom[0].children[0].children[1].data,
                };
              });
              const parser = new htmlparser.Parser(handler);
              parser.parseComplete(rawHtml);

              return res;
            }),
            catchError<
              Response<CommitResponseDto>,
              Observable<Response<CommitResponseDto>>
            >((error) => {
              const err = error as AxiosError;
              logger.endResponse(err.response);
              if (err.code === AxiosError.ETIMEDOUT) {
                const res = newResponse<CommitResponseDto>().setMsg(
                  ErrorCode.TIMEOUT,
                );
                return of(res);
              } else {
                const res = newResponse<CommitResponseDto>().setMsg(
                  ErrorCode.SYSTEM_FAIL,
                );
                return of(res);
              }
            }),
          ),
        );
        switch (getRes.errorCode) {
          case ErrorCode.SUCCESS:
            const success = getRes.results.status === FirewallErrorCode.Success;
            if (!success) res.setMsg(ErrorCode.EXEC_FAIL);
            return res;
          case ErrorCode.TIMEOUT:
            res.setMsg(ErrorCode.TIMEOUT);
            break;
          default:
            res.setMsg(ErrorCode.SYSTEM_FAIL);
            break;
        }
      }
    } catch (err) {
      this._logger.error(err);
      res.setMsg(ErrorCode.SYSTEM_FAIL);
    } finally {
      return res;
    }
  }
}
