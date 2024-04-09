import { Inject, Injectable } from '@nestjs/common';
import { LoginRequirementDo } from '../do/login-requirement.do';
import { Response, newResponse } from '../../common/entities/response.entity';
import { IEnableConnectionFirewallService } from '../interface/enable-connection-firewall-service.interface';
import {
  IFirewallServiceType,
  IFirewallService,
} from '../interface/firewall-service.interface';
import { ErrorCode } from '../../common/error/error-code.enum';
import { CommonService } from '../common/common.service';

@Injectable()
export class EnableConnectionFirewallServiceAdp
  implements IEnableConnectionFirewallService
{
  constructor(
    @Inject(IFirewallServiceType)
    private readonly _firewallService: IFirewallService,
    @Inject(CommonService) private readonly _commonService: CommonService,
  ) {}

  async getAsync(id: bigint): Promise<Response<LoginRequirementDo>> {
    return await this._commonService.getAsync(id);
  }

  async enable(loginRequirement: LoginRequirementDo): Promise<Response<void>> {
    const configAsyncRes = await this._firewallService.configAsync(
      loginRequirement.username,
      true,
    );
    if (configAsyncRes.errorCode != ErrorCode.SUCCESS) return configAsyncRes;

    const commitAsyncRes = await this._firewallService.commitAsync(
      loginRequirement.description,
    );
    if (commitAsyncRes.errorCode != ErrorCode.SUCCESS) return commitAsyncRes;

    return newResponse<void>();
  }

  async disable(username: string): Promise<Response<void>> {
    const configAsyncRes = await this._firewallService.configAsync(
      username,
      false,
    );
    if (configAsyncRes.errorCode != ErrorCode.SUCCESS) return configAsyncRes;

    const commitAsyncRes = await this._firewallService.commitAsync(username);
    if (commitAsyncRes.errorCode != ErrorCode.SUCCESS) return commitAsyncRes;

    return newResponse<void>();
  }
}
