import { FactoryProvider, LoggerService, Provider } from '@nestjs/common';
import { Redis } from 'ioredis';
import { IConfig, IConfigType } from '../../config/interface/config.interface';
import { LoginCacheService } from './login/login-cache.service';
import { ILoggerServiceType } from '../log/interface/logger.interface';
import { IAnswerCacheServiceType } from '../../captcha/interface/answer-cache-service.interface';
import { AnswerCacheService } from './captcha/answer-cache.service';
import { ILoginRequirementStorageServiceType } from '../../login/interface/login-requirement-storage-service.interface';

export const redisClientProvider: FactoryProvider<Redis> = {
  provide: Redis,
  useFactory: (logger: LoggerService, config: IConfig) => {
    const redisInstance = new Redis({
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
      retryStrategy(times) {
        const delay = Math.min(times * times + 50, 3000);
        return delay;
      },
      maxRetriesPerRequest: 3,
    });

    redisInstance.on('error', (err) => {
      logger.error(err);
    });

    return redisInstance;
  },
  inject: [
    { token: ILoggerServiceType, optional: false },
    { token: IConfigType, optional: false },
  ],
};

export const redisServiceProvider: Provider[] = [
  {
    provide: ILoginRequirementStorageServiceType,
    useClass: LoginCacheService,
  },
  {
    provide: IAnswerCacheServiceType,
    useClass: AnswerCacheService,
  },
];
