import { Inject, Injectable, LoggerService } from '@nestjs/common';
import {
  Response,
  newResponse,
} from '../../../common/response';
import { LoginRequirement } from '../../../login/entities/login-requirement.enetity';
import { IRequestLoggerServiceType } from '../../log/interface/logger.interface';
import Redis from 'ioredis';
import { Key } from '../namespace/key.namespace';
import { ErrorCode } from '../../../common/error/error-code.enum';
import { instanceToPlain } from 'class-transformer';
import { ILoginRequirementStorageService } from '../../../login/interface/login-requirement-storage-service.interface';
import { IGetStorageService } from '../../../login/interface/get-storage-service.interface';

@Injectable()
export class LoginCacheService
  implements ILoginRequirementStorageService, IGetStorageService
{
  private static keyOf(username: string): string {
    return `${Key.LOGIN_REQUIREMENT}:${username}`;
  }

  constructor(
    @Inject(IRequestLoggerServiceType) private readonly _logger: LoggerService,
    private readonly _redis: Redis,
  ) {}

  async getAsync(username?: string): Promise<Response<LoginRequirement[]>> {
    const res = newResponse<LoginRequirement[]>([]);

    try {
      let keys: string[];
      if (username) {
        const key = LoginCacheService.keyOf(username);
        keys = [key];
      } else {
        const key = LoginCacheService.keyOf('*');
        keys = await this._redis.keys(key);
      }

      if (keys.length === 0) {
        return res;
      }

      const jsStrs = await this._redis.mget(keys);
      res.results = jsStrs.map((jsStr) => {
        const loginRequirement = new LoginRequirement(JSON.parse(jsStr));
        return loginRequirement;
      });
    } catch (e) {
      this._logger.error(e);
      res.setMsg(ErrorCode.SYSTEM_FAIL);
    } finally {
      return res;
    }
  }

  async saveAsync(
    loginRequirement: LoginRequirement,
    timeoutSec: number,
  ): Promise<Response<void>> {
    const res = newResponse<void>();
    try {
      const key = LoginCacheService.keyOf(loginRequirement.username);

      const jsStr = JSON.stringify(
        instanceToPlain(loginRequirement, {
          excludeExtraneousValues: true,
          groups: ['store'],
        }),
      )
        .replace('"{', '{')
        .replace('}"', '}')
        .replaceAll('\\"', '"');

      const setnxRes = await this._redis.setnx(key, jsStr);
      const success = setnxRes > 0;
      if (!success) {
        return res.setMsg(ErrorCode.EXISTING);
      }

      await this._redis.set(key, jsStr, 'EX', timeoutSec);
    } catch (e) {
      this._logger.error(e);
      res.setMsg(ErrorCode.SYSTEM_FAIL);
    } finally {
      return res;
    }
  }

  async removeAsync(username: string): Promise<Response<number>> {
    const res = newResponse<number>();
    try {
      const key = LoginCacheService.keyOf(username);

      res.results = await this._redis.del(key);
    } catch (e) {
      this._logger.error(e);
      res.setMsg(ErrorCode.SYSTEM_FAIL);
    } finally {
      return res;
    }
  }
}
