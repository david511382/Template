import { Response } from '../entities/response.entity';

export interface IInternalSignService {
  signInternalTokenAsync(): Promise<Response<string>>;
  verifyInternalTokenAsync(token: string): Promise<Response<void>>;
}

export const IInternalSignServiceType = Symbol('IInternalSignService');
