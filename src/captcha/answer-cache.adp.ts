import { Inject, Injectable } from '@nestjs/common';
import { ICreateCacheService } from './interface/create-cache-service.interface';
import { Response } from '../common/entities/response.entity';
import { Answer } from './entities/answer.entity';
import { IConfig, IConfigType } from '../config/interface/config.interface';
import {
  IAnswerCacheService,
  IAnswerCacheServiceType,
} from './interface/answer-cache-service.interface';
import { IVerifyCacheService } from './interface/verify-cache-service.interface';

@Injectable()
export class AnswerCacheAdp
  implements ICreateCacheService, IVerifyCacheService
{
  private readonly TIMEOUT_SEC: number;

  constructor(
    @Inject(IAnswerCacheServiceType)
    private readonly _answerCacheService: IAnswerCacheService,
    @Inject(IConfigType) config: IConfig,
  ) {
    this.TIMEOUT_SEC = config.captcha.timeoutMins * 60;
  }

  async saveAnswerAsync(answer: Answer): Promise<Response<void>> {
    return await this._answerCacheService.saveAsync(answer, this.TIMEOUT_SEC);
  }

  async findAnswerAsync(id: string): Promise<Response<Answer>> {
    return await this._answerCacheService.findAsync(id);
  }
}
