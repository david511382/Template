import { Response } from '../../common/response';
import { UserDo } from '../do/user.do';

export interface IIsExistService {
  runAsync(user: UserDo): Promise<Response<boolean>>;
}

export const IIsExistServiceType = Symbol('IIsExistService');
