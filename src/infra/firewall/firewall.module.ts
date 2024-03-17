import { Module } from '@nestjs/common';
import { FirewallService } from './firewall.service';
import { IFirewallServiceType } from '../../login/interface/firewall-service.interface';
import { HttpModule } from '@nestjs/axios';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [CommonModule, HttpModule],
  providers: [
    {
      provide: IFirewallServiceType,
      useClass: FirewallService,
    },
  ],
  exports: [IFirewallServiceType],
})
export class FirewallModule {}
