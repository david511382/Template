import { Response } from '../../../common/response';
import { UserDo } from '../../do/user.do';

export interface ICreateStorageService {
  createAsync(user: UserDo): Promise<Response<UserDo>>;
}

export const ICreateStorageServiceType = Symbol('ICreateStorageService');
