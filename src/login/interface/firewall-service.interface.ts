import { Response } from '../../common/entities/response.entity';

export interface IFirewallService {
  configAsync(username: string, enable: boolean): Promise<Response<void>>;
  commitAsync(description: string): Promise<Response<void>>;
}

export const IFirewallServiceType = Symbol('IFirewallService');
