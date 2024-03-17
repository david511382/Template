import { Module } from '@nestjs/common';
import { redisClientProvider, redisServiceProvider } from './redis.provider';
import { CommonModule } from '../../common/common.module';
import { IAnswerCacheServiceType } from '../../captcha/interface/answer-cache-service.interface';
import { ILoginRequirementStorageServiceType } from '../../login/interface/login-requirement-storage-service.interface';

@Module({
  imports: [CommonModule],
  providers: [redisClientProvider, ...redisServiceProvider],
  exports: [ILoginRequirementStorageServiceType, IAnswerCacheServiceType],
})
export class RedisModule {}
