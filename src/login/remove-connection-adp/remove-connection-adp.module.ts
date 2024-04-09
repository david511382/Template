import { Module } from '@nestjs/common';
import { IRemoveConnectionFirewallServiceType } from '../interface/remove-connection-firewall-service.interface';
import { FirewallModule } from '../../infra/firewall/firewall.module';
import { RemoveConnectionFirewallServiceAdp } from './remove-connection-firewall-service.adp';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, FirewallModule],
  providers: [
    {
      provide: IRemoveConnectionFirewallServiceType,
      useClass: RemoveConnectionFirewallServiceAdp,
    },
  ],
  exports: [IRemoveConnectionFirewallServiceType],
})
export class RemoveConnectionAdpModule {}
