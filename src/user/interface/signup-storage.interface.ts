import { Response } from '../../common/response';
import { User } from '../entities/utm.entity';

export interface ISignupStorageService {
  isExsitAsync(user: User): Promise<Response<boolean>>;
}

export const ISignupStorageServiceType = Symbol('ISignupStorageService');
