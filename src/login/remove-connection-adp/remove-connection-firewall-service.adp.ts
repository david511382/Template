import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { Response, newResponse } from '../../common/response';
import {
  IFirewallServiceType,
  IFirewallService,
} from '../interface/firewall-service.interface';
import { ErrorCode } from '../../common/error/error-code.enum';
import { IRemoveConnectionFirewallService } from '../interface/remove-connection-firewall-service.interface';
import { Agent } from 'https';
import { firstValueFrom, map, catchError, Observable, of } from 'rxjs';
import { IConfigType, IConfig } from '../../config/interface/config.interface';
import { AxiosErrorCode } from '../../infra/ide/enum/axios-error-code.enum';
import { HttpService } from '@nestjs/axios';
import { InternalTokenType } from '../../app.const';
import { IRequestLoggerServiceType } from '../../infra/log/interface/logger.interface';

@Injectable()
export class RemoveConnectionFirewallServiceAdp
  implements IRemoveConnectionFirewallService
{
  constructor(
    @Inject(IConfigType) private readonly _config: IConfig,
    @Inject(IFirewallServiceType)
    private readonly _firewallService: IFirewallService,
    private readonly _httpService: HttpService,
    @Inject(InternalTokenType) private readonly INTERNAL_TOKEN: string,
    @Inject(IRequestLoggerServiceType) private readonly _logger: LoggerService,
  ) {}

  async disable(username: string): Promise<Response<void>> {
    const res = newResponse<void>();

    // disable firewall
    {
      const configAsyncRes = await this._firewallService.configAsync(
        username,
        false,
      );
      if (configAsyncRes.errorCode != ErrorCode.SUCCESS) return configAsyncRes;

      const commitAsyncRes = await this._firewallService.commitAsync(username);
      if (commitAsyncRes.errorCode != ErrorCode.SUCCESS) return commitAsyncRes;
    }

    // remove cron
    {
      const { cronServer: cronConfig } = this._config;
      const name = `disable-${username}`;
      const url = `${cronConfig.protocol}://${cronConfig.host}:${cronConfig.port}/schedule/cronjob/${name}`;
      const method = 'delete';
      const headers = {
        Authorization: `Bearer ${this.INTERNAL_TOKEN}`,
      };
      const httpsAgent = new Agent({
        rejectUnauthorized: false,
        timeout: 5 * 1000,
      });
      const postRes = await firstValueFrom(
        this._httpService
          .request({
            method,
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
    }

    return newResponse<void>();
  }
}