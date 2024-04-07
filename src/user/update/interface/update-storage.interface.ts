import { Response } from '../../../common/response';
import { UserDo } from '../../do/user.do';

export interface IUpdateStorageService {
  updateAsync(user: UserDo): Promise<Response<void>>;
}

export const IUpdateStorageServiceType = Symbol('IUpdateStorageService');
