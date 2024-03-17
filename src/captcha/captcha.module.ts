import { Module } from '@nestjs/common';
import { CaptchaController } from './captcha.controller';
import { CaptchaService } from './captcha.service';
import { ICreateCacheServiceType } from './interface/create-cache-service.interface';
import { AnswerCacheAdp } from './answer-cache.adp';
import { IVerifyCacheServiceType } from './interface/verify-cache-service.interface';
import { RedisModule } from '../infra/redis/redis.module';
import { CommonModule } from '../common/common.module';
import { NativeCaptchaModule } from '../infra/captcha/native-captcha.module';
import { CaptchaGuard } from './captcha.guard';

@Module({
  imports: [NativeCaptchaModule, CommonModule, RedisModule],
  controllers: [CaptchaController],
  providers: [
    CaptchaService,
    {
      provide: ICreateCacheServiceType,
      useClass: AnswerCacheAdp,
    },
    {
      provide: IVerifyCacheServiceType,
      useClass: AnswerCacheAdp,
    },
    CaptchaGuard,
  ],
  exports: [CaptchaGuard],
})
export class CaptchaModule {}
