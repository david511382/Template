import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { RedisModule } from '../infra/redis/redis.module';
import { IdeModule } from '../infra/ide/ide.module';
import { IIdeServiceType } from './interface/ide-service.interface';
import { IdeAdpService } from './ide-adp.service';
import { IGetStorageServiceType } from './interface/get-storage-service.interface';
import { CreateStorageAdp } from './create-storage.adp';
import { ICreateStorageServiceType } from './interface/create-storage-service.interface';
import { ILoginRequirementStorageServiceType } from './interface/login-requirement-storage-service.interface';
import { RemoveConnectionAdpModule } from './remove-connection-adp/remove-connection-adp.module';
import { SetModule } from './set-adp/set.module';

@Module({
  imports: [IdeModule, RedisModule, SetModule, RemoveConnectionAdpModule],
  controllers: [LoginController],
  providers: [
    LoginService,
    {
      provide: IGetStorageServiceType,
      useExisting: ILoginRequirementStorageServiceType,
    },
    {
      provide: ICreateStorageServiceType,
      useClass: CreateStorageAdp,
    },
    {
      provide: IIdeServiceType,
      useClass: IdeAdpService,
    },
  ],
})
export class LoginModule {}
