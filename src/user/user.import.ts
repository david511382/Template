import { CacheModule } from '@nestjs/cache-manager';
import { DbModule } from '../infra/db/db.module';

export const userImports = [CacheModule.register()];

export const userServiceImports = [DbModule];
