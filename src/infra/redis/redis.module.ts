import { Module } from '@nestjs/common';
import { redisClientProvider, redisServiceProvider } from './redis.provider';
import { CommonModule } from '../../common/common.module';
import { IAnswerCacheServiceType } from '../../captcha/interface/answer-cache-service.interface';

@Module({
  imports: [CommonModule],
  providers: [redisClientProvider, ...redisServiceProvider],
  exports: [IAnswerCacheServiceType],
})
export class RedisModule {}
