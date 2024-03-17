import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { IdeModule } from '../infra/ide/ide.module';
import { IIdeServiceType } from './interface/ide-service.interface';
import { IdeAdpService } from './ide-adp.service';
import { SignModule } from '../infra/sign/sign.module';
import { ISignServiceType } from './interface/sign.interface';

@Module({
  imports: [
    SignModule.register({ token: ISignServiceType, expiresIn: '1h' }),
    IdeModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: IIdeServiceType,
      useClass: IdeAdpService,
    },
  ],
})
export class AuthModule {}
