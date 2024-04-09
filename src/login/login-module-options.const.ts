import { IdeModule } from '../infra/ide/ide.module';
import { RedisModule } from '../infra/redis/redis.module';
import { CreateAdpModule } from './create-adp/create-adp.module';
import { EnableConnectionAdpModule } from './enable-connection-adp/enable-connection-adp.module';
import { GetAdpModule } from './get-adp/get-adp.module';
import { RemoveConnectionAdpModule } from './remove-connection-adp/remove-connection-adp.module';
import { SetModule } from './set-adp/set.module';

export const serviceImports = [IdeModule, RedisModule];
export const adpImports = [
  CreateAdpModule,
  GetAdpModule,
  SetModule,
  RemoveConnectionAdpModule,
  EnableConnectionAdpModule,
];
