import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { LogModule } from '../infra/log/log.module';
import { IIdFactoryType } from './interface/id-factory.interface';
import { IdFactory } from '../infra/id-factory/id-factory';
import { InternalTokenType } from '../app.const';
import { ErrorCode } from './error/error-code.enum';
import { SignModule } from '../auth/sign/sign.module';
import {
  IInternalSignService,
  IInternalSignServiceType,
} from './interface/internal-sign.interface';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';

@Global()
@Module({
  imports: [ConfigModule, LogModule, AuthModule],
  providers: [
    {
      provide: IIdFactoryType,
      useClass: IdFactory,
    },
    {
      provide: InternalTokenType,
      useFactory: async (authService: IInternalSignService) => {
        let internalToken;
        {
          const signInternalTokenAsyncRes =
            await authService.signInternalTokenAsync();
          switch (signInternalTokenAsyncRes.errorCode) {
            case ErrorCode.SUCCESS:
              internalToken = signInternalTokenAsyncRes.results;
              break;
            default:
              return undefined;
          }
        }
        return internalToken;
      },
      inject: [{ token: AuthService, optional: false }],
    },
  ],
  exports: [IIdFactoryType, InternalTokenType],
})
export class CommonModule {}
