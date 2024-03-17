import { Response } from '../response';

export interface IInternalSignService {
  signInternalTokenAsync(): Promise<Response<string>>;
  verifyInternalTokenAsync(token: string): Promise<Response<void>>;
}

export const IInternalSignServiceType = Symbol('IInternalSignService');
