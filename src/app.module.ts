import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './infra/log/logger.middleware';
import { AuthGuard } from './auth/auth.guard';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CaptchaModule } from './captcha/captcha.module';
import { CaptchaGuard } from './captcha/captcha.guard';
import { ScheduleModule } from './schedule/schedule.module';
import { OperationRecordModule } from './operation-record/operation-record.module';
import { ResponseParserMiddleware } from './infra/log/response-parser.middleware';
import { UserModule } from './user/user.module';
import { TransformInterceptor } from './common/transform.interceptor';
import { ErrorFilter } from './common/error.filter';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { InternalTokenType } from './app.const';
import { ErrorCode } from './common/error/error-code.enum';
import {
  IInternalSignService,
  IInternalSignServiceType,
} from './common/interface/internal-sign.interface';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    CaptchaModule,
    ScheduleModule,
    OperationRecordModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useExisting: CaptchaGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware, ResponseParserMiddleware).forRoutes('*');
  }
}
