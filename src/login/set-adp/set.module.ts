import { Module } from '@nestjs/common';
import { RedisModule } from '../../infra/redis/redis.module';
import { SetStorageAdp } from './set-storage.adp';
import { ISetStorageServiceType } from '../interface/set-storage-service.interface';
import { ISetFirewallServiceType } from '../interface/set-firewall-service.interface';
import { SetFirewallServiceAdp } from './set-firewall-service.adp';
import { FirewallModule } from '../../infra/firewall/firewall.module';
import { ISetEventServiceType } from '../interface/set-event-service.interface';
import { HttpCronEventAdp } from './http-cron-event.adp';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, FirewallModule, RedisModule],
  providers: [
    {
      provide: ISetStorageServiceType,
      useClass: SetStorageAdp,
    },
    {
      provide: ISetFirewallServiceType,
      useClass: SetFirewallServiceAdp,
    },
    {
      provide: ISetEventServiceType,
      useClass: HttpCronEventAdp,
    },
  ],
  exports: [
    ISetStorageServiceType,
    ISetFirewallServiceType,
    ISetEventServiceType,
  ],
})
export class SetModule {}
