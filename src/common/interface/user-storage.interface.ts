import {
  User,
  QueryableUserProps,
} from '../../user/entities/user.entity';
import { Response } from '../response';

export interface IUserStorageService {
  createAsync(user: User): Promise<Response<User>>;
  findAsync(dto: QueryableUserProps): Promise<Response<User>>;
  updateAsync(user: User): Promise<Response<void>>;
}

export const IUserStorageServiceType = Symbol('IUserStorageService');
