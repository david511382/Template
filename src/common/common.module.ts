import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { LogModule } from '../infra/log/log.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { IIdFactoryType } from './interface/id-factory.interface';
import { IdFactory } from '../infra/id-factory/id-factory';
import { InternalTokenType } from '../app.const';
import { ErrorCode } from './error/error-code.enum';
import { SignModule } from '../infra/sign/sign.module';
import {
  IInternalSignService,
  IInternalSignServiceType,
} from './interface/internal-sign.interface';

@Global()
@Module({
  imports: [
    ConfigModule,
    LogModule,
    SignModule.register({
      token: IInternalSignServiceType,
      expiresIn: undefined,
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: IIdFactoryType,
      useClass: IdFactory,
    },
    {
      provide: InternalTokenType,
      useFactory: async (internalTokenFactory: IInternalSignService) => {
        let internalToken;
        {
          const signInternalTokenAsyncRes =
            await internalTokenFactory.signInternalTokenAsync();
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
      inject: [{ token: IInternalSignServiceType, optional: false }],
    },
  ],
  exports: [IIdFactoryType, InternalTokenType],
})
export class CommonModule {}
