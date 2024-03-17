import { Response } from '../../common/response';
import { Answer } from '../entities/answer.entity';

export interface IVerifyCacheService {
  findAnswerAsync(id: string): Promise<Response<Answer>>;
}

export const IVerifyCacheServiceType = Symbol('IVerifyCacheService');
