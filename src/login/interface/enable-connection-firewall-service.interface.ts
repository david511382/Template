import { Response } from '../../common/entities/response.entity';
import { LoginRequirementDo } from '../do/login-requirement.do';

export interface IEnableConnectionFirewallService {
  getAsync(id: bigint): Promise<Response<LoginRequirementDo>>;
  enable(loginRequirement: LoginRequirementDo): Promise<Response<void>>;
}

export const IEnableConnectionFirewallServiceType = Symbol(
  'IEnableConnectionFirewallService',
);
