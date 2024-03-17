import { Response } from '../../common/response';

export interface IRemoveConnectionFirewallService {
  disable(username: string): Promise<Response<void>>;
}

export const IRemoveConnectionFirewallServiceType = Symbol(
  'IRemoveConnectionFirewallService',
);
