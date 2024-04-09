import { Module } from '@nestjs/common';
import { FirewallModule } from '../../infra/firewall/firewall.module';
import { HttpModule } from '@nestjs/axios';
import { IEnableConnectionFirewallServiceType } from '../interface/enable-connection-firewall-service.interface';
import { EnableConnectionFirewallServiceAdp } from './enable-connection-firewall-service.adp';
import { DbModule } from '../../infra/db/db.module';
import { LoginRequirementFactory } from '../login-requirement-factory';

@Module({
  imports: [HttpModule, FirewallModule, DbModule],
  providers: [
    LoginRequirementFactory,
    {
      provide: IEnableConnectionFirewallServiceType,
      useClass: EnableConnectionFirewallServiceAdp,
    },
  ],
  exports: [IEnableConnectionFirewallServiceType],
})
export class EnableConnectionAdpModule {}
