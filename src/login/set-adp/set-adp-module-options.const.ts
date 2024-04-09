import { HttpModule } from '@nestjs/axios';
import { DbModule } from '../../infra/db/db.module';
import { FirewallModule } from '../../infra/firewall/firewall.module';
import { RedisModule } from '../../infra/redis/redis.module';

export const infraImports = [HttpModule, FirewallModule, RedisModule, DbModule];
export const serviceImports = [];
