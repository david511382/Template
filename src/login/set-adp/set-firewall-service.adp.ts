import { Inject, Injectable } from '@nestjs/common';
import { LoginRequirement } from '../entities/login-requirement.enetity';
import { Response, newResponse } from '../../common/response';
import { ISetFirewallService } from '../interface/set-firewall-service.interface';
import {
  IFirewallServiceType,
  IFirewallService,
} from '../interface/firewall-service.interface';
import { ErrorCode } from '../../common/error/error-code.enum';

@Injectable()
export class SetFirewallServiceAdp implements ISetFirewallService {
  constructor(
    @Inject(IFirewallServiceType)
    private readonly _firewallService: IFirewallService,
  ) {}

  async enable(loginRequirement: LoginRequirement): Promise<Response<void>> {
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
