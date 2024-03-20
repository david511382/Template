import { Response } from '../../common/response';
import { User } from '../entities/utm.entity';

export interface ICreateStorageService {
  createAsync(user: User): Promise<Response<User>>;
}

export const ICreateStorageServiceType = Symbol('ICreateStorageService');
