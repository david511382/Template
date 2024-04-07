import { Response } from '../../common/response';
import { UserDo } from '../do/user.do';

export interface ICreateService {
  runAsync(user: UserDo): Promise<Response<UserDo>>;
}

export const ICreateServiceType = Symbol('ICreateService');
