import { Response } from '../../common/entities/response.entity';
import { Answer } from '../entities/answer.entity';

export interface ICreateCacheService {
  saveAnswerAsync(answer: Answer): Promise<Response<void>>;
}

export const ICreateCacheServiceType = Symbol('ICreateCacheService');
