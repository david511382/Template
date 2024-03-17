import { Response } from '../../common/response';
import { LoginRequirement } from '../entities/login-requirement.enetity';

export interface ISetFirewallService {
  enable(loginRequirement: LoginRequirement): Promise<Response<void>>;
  disable(username: string): Promise<Response<void>>;
}

export const ISetFirewallServiceType = Symbol('ISetFirewallService');
