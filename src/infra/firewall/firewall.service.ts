import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { Response, newResponse } from '../../common/response';
import { IFirewallService } from '../../login/interface/firewall-service.interface';
import { HttpService } from '@nestjs/axios';
import { Agent } from 'https';
import { firstValueFrom, map, catchError, Observable, of, tap } from 'rxjs';
import { IConfigType, IConfig } from '../../config/interface/config.interface';
import { IRequestLoggerServiceType } from '../log/interface/logger.interface';
import { ConfigResponse } from './dto/config-response.dto';
import { AxiosErrorCode } from './enum/axios-error-code.enum';
import { ErrorCode } from '../../common/error/error-code.enum';
import { ErrorCode as FirewallErrorCode } from './enum/error-code.enum';
import { CommitResponse } from './dto/commit-response.dto';
import { HttpLog } from '../log/http-log';
const htmlparser = require('htmlparser');

@Injectable()
export class FirewallService implements IFirewallService {
  constructor(
    @Inject(IConfigType) private readonly _config: IConfig,
    @Inject(IRequestLoggerServiceType) private readonly _logger: LoggerService,
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
          timeout: 10 * 1000,
        });
        const log = new HttpLog({
          method: 'GET',
          path: url,
        }).start();
        const postRes = await firstValueFrom(
          this._httpService.get(url, { httpsAgent }).pipe(
            tap((response) => {
              log.end();
              log.res.body = response.data;
              this._logger.debug(log.simple);
            }),
            map((response) => {
              const res = newResponse<ConfigResponse>();

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
              Response<ConfigResponse>,
              Observable<Response<ConfigResponse>>
            >((error) => {
              this._logger.error(error);
              if (error.code === AxiosErrorCode.Timeout) {
                const res = newResponse<ConfigResponse>().setMsg(
                  ErrorCode.TIMEOUT,
                );
                return of(res);
              } else {
                const res = newResponse<ConfigResponse>().setMsg(
                  ErrorCode.SYSTEM_FAIL,
                );
                return of(res);
              }
            }),
          ),
        );
        switch (postRes.errorCode) {
          case ErrorCode.SUCCESS:
            const success =
              postRes.results.status === FirewallErrorCode.Success;
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
          timeout: 10 * 1000,
        });
        const log = new HttpLog({
          method: 'GET',
          path: url,
        }).start();
        const getRes = await firstValueFrom(
          this._httpService.get(url, { httpsAgent }).pipe(
            tap((response) => {
              log.end();
              log.res.body = response.data;
              this._logger.debug(log.simple);
            }),
            map((response) => {
              const res = newResponse<CommitResponse>();

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
              Response<CommitResponse>,
              Observable<Response<CommitResponse>>
            >((error) => {
              this._logger.error(error);
              if (error.code === AxiosErrorCode.Timeout) {
                const res = newResponse<CommitResponse>().setMsg(
                  ErrorCode.TIMEOUT,
                );
                return of(res);
              } else {
                const res = newResponse<CommitResponse>().setMsg(
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
