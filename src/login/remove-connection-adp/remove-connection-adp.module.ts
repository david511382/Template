import { Module } from '@nestjs/common';
import { IRemoveConnectionFirewallServiceType } from '../interface/remove-connection-firewall-service.interface';
import { FirewallModule } from '../../infra/firewall/firewall.module';
import { RemoveConnectionFirewallServiceAdp } from './remove-connection-firewall-service.adp';
import { HttpModule } from '@nestjs/axios';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule, HttpModule, FirewallModule],
  providers: [
    {
      provide: IRemoveConnectionFirewallServiceType,
      useClass: RemoveConnectionFirewallServiceAdp,
    },
  ],
  exports: [IRemoveConnectionFirewallServiceType],
})
export class RemoveConnectionAdpModule {}
