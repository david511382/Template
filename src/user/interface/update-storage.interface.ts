import { Response } from '../../common/response';
import { User } from '../entities/utm.entity';

export interface IUpdateStorageService {
  updateAsync(user: User): Promise<Response<void>>;
}

export const IUpdateStorageServiceType = Symbol('IUpdateStorageService');
