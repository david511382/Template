import { Response } from '../../common/entities/response.entity';

export interface IRemoveConnectionFirewallService {
  disable(username: string): Promise<Response<void>>;
}

export const IRemoveConnectionFirewallServiceType = Symbol(
  'IRemoveConnectionFirewallService',
);
