import { Response } from '../../common/entities/response.entity';
import { LoginRequirementDo } from '../do/login-requirement.do';

export interface IRemoveConnectionFirewallService {
  getAsync(id: bigint): Promise<Response<LoginRequirementDo>>;
  disable(loginRequirement: LoginRequirementDo): Promise<Response<void>>;
}

export const IRemoveConnectionFirewallServiceType = Symbol(
  'IRemoveConnectionFirewallService',
);
