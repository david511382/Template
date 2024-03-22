import { Response } from '../../common/response';
import { UserDo } from '../do/user.do';

export interface ISignupStorageService {
  isExsitAsync(user: UserDo): Promise<Response<boolean>>;
}

export const ISignupStorageServiceType = Symbol('ISignupStorageService');
