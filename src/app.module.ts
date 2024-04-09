import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { LoginModule } from './login/login.module';
import { LoggerMiddleware } from './infra/http/middleware/logger.middleware';
import { AuthGuard } from './infra/http/guard/auth.guard';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CaptchaModule } from './captcha/captcha.module';
import { CaptchaGuard } from './captcha/captcha.guard';
import { ScheduleModule } from './schedule/schedule.module';
import { OperationRecordModule } from './operation-record/operation-record.module';
import { ResponseParserMiddleware } from './infra/http/middleware/response-parser.middleware';
import { OperationRecordInterceptor } from './operation-record/operation-record.interceptor';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    CommonModule,
    AuthModule,
    LoginModule,
    CaptchaModule,
    ScheduleModule,
    OperationRecordModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useExisting: CaptchaGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: OperationRecordInterceptor,
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
