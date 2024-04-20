import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { Response, newResponse } from '../../common/entities/response.entity';
import {
  IFirewallServiceType,
  IFirewallService,
} from '../interface/firewall-service.interface';
import { ErrorCode } from '../../common/error/error-code.enum';
import { IRemoveConnectionFirewallService } from '../interface/remove-connection-firewall-service.interface';
import { Agent } from 'https';
import { firstValueFrom, map, catchError, Observable, of } from 'rxjs';
import { IConfigType, IConfig } from '../../config/interface/config.interface';
import { HttpService } from '@nestjs/axios';
import { InternalTokenType } from '../../app.const';
import { IRequestLoggerServiceType } from '../../infra/log/interface/logger.interface';
import { AxiosError } from 'axios';
import { LoginRequirementDo } from '../do/login-requirement.do';
import { CommonService } from '../common/common.service';
import { HttpExceptionFilter } from '../../common/filter/http-exception.filter';

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
    @Inject(CommonService) private readonly _commonService: CommonService,
  ) {}

  async getAsync(id: bigint): Promise<Response<LoginRequirementDo>> {
    return await this._commonService.getAsync(id);
  }

  async disable(loginRequirement: LoginRequirementDo): Promise<Response<void>> {
    const res = newResponse<void>();

    // disable firewall
    {
      const configAsyncRes = await this._firewallService.configAsync(
        loginRequirement.username,
        false,
      );
      if (configAsyncRes.errorCode != ErrorCode.SUCCESS) return configAsyncRes;

      const commitAsyncRes = await this._firewallService.commitAsync(
        loginRequirement.description,
      );
      if (commitAsyncRes.errorCode != ErrorCode.SUCCESS) return commitAsyncRes;
    }

    // remove cron
    {
      const { cronServer: cronConfig } = this._config;
      const id = `disable-${loginRequirement.id}`;
      const url = `${cronConfig.protocol}://${cronConfig.host}:${cronConfig.port}/api/schedule/cronjob/${id}`;
      const method = 'delete';
      const headers = {
        Authorization: `Bearer ${this.INTERNAL_TOKEN}`,
      };
      const httpsAgent = new Agent({
        rejectUnauthorized: false,
      });
      const postRes = await firstValueFrom(
        this._httpService
          .request({
            method,
            headers,
            url,
            httpsAgent,
            timeout: 5 * 1000,
          })
          .pipe(
            map((res) => {
              return newResponse<void>();
            }),
            catchError<Response<void>, Observable<Response<void>>>((error) => {
              this._logger.error(error);
              if (error.code === AxiosError.ETIMEDOUT) {
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
