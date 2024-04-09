import { Response } from '../../common/entities/response.entity';
import { Answer } from '../entities/answer.entity';

export interface IAnswerCacheService {
  saveAsync(answer: Answer, timeoutSec: number): Promise<Response<void>>;
  findAsync(id: string): Promise<Response<Answer>>;
}

export const IAnswerCacheServiceType = Symbol('IAnswerCacheService');
