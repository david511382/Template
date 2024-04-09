import { Module } from '@nestjs/common';
import { FirewallModule } from '../../infra/firewall/firewall.module';
import { HttpModule } from '@nestjs/axios';
import { IEnableConnectionFirewallServiceType } from '../interface/enable-connection-firewall-service.interface';
import { EnableConnectionFirewallServiceAdp } from './enable-connection-firewall-service.adp';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule, HttpModule, FirewallModule],
  providers: [
    {
      provide: IEnableConnectionFirewallServiceType,
      useClass: EnableConnectionFirewallServiceAdp,
    },
  ],
  exports: [IEnableConnectionFirewallServiceType],
})
export class EnableConnectionAdpModule {}
