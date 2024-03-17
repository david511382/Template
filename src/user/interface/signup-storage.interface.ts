import { Response } from '../../common/response';
import { User } from '../../user/entities/user.entity';

export interface ISignupStorageService {
  isExsitAsync(user: User): Promise<Response<boolean>>;
}

export const ISignupStorageServiceType = Symbol('ISignupStorageService');
