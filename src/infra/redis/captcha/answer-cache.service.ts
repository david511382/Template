import { Inject, Injectable, LoggerService } from '@nestjs/common';
import {
  Response,
  newResponse,
} from '../../../common/entities/response.entity';
import { IRequestLoggerServiceType } from '../../log/interface/logger.interface';
import Redis from 'ioredis';
import { Key } from '../namespace/key.namespace';
import { ErrorCode } from '../../../common/error/error-code.enum';
import { instanceToPlain } from 'class-transformer';
import { IAnswerCacheService } from '../../../captcha/interface/answer-cache-service.interface';
import { Answer } from '../../../captcha/entities/answer.entity';

@Injectable()
export class AnswerCacheService implements IAnswerCacheService {
  private static keyOf(id: string): string {
    return `${Key.CAPTCHA_ANSWER}:${id}`;
  }

  constructor(
    @Inject(IRequestLoggerServiceType) private readonly _logger: LoggerService,
    private readonly _redis: Redis,
  ) {}

  async saveAsync(answer: Answer, timeoutSec: number): Promise<Response<void>> {
    const res = newResponse<void>();
    try {
      const key = AnswerCacheService.keyOf(answer.id);

      const jsStr = JSON.stringify(
        instanceToPlain(answer, { excludeExtraneousValues: true }),
      )
        .replace('"{', '{')
        .replace('}"', '}')
        .replaceAll('\\"', '"');

      await this._redis.set(key, jsStr, 'EX', timeoutSec);
    } catch (e) {
      this._logger.error(e);
      res.setMsg(ErrorCode.SYSTEM_FAIL);
    } finally {
      return res;
    }
  }

  async findAsync(id: string): Promise<Response<Answer>> {
    const res = newResponse<Answer>();

    try {
      const key = AnswerCacheService.keyOf(id);

      const jsStr = await this._redis.get(key);
      if (!jsStr) return res.setMsg(ErrorCode.NOT_FOUND);

      res.results = new Answer(JSON.parse(jsStr));
    } catch (e) {
      this._logger.error(e);
      res.setMsg(ErrorCode.SYSTEM_FAIL);
    } finally {
      return res;
    }
  }
}
