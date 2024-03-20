import { Response } from '../../common/response';
import { UpdateServiceDto } from '../../user/dto/update-servive.dto';
import {
  User,
  QueryableUserEntity,
} from '../entities/utm.entity';
import { IUserFactory } from './user-factory.interface';

export interface IUserService extends IUserFactory {
  isExsitAsync(user: User): Promise<Response<boolean>>;
  createAsync(user: User): Promise<Response<User>>;
  findAsync(dto: QueryableUserEntity): Promise<Response<User>>;
  updateAsync(dto: UpdateServiceDto): Promise<Response<void>>;
}

export const IUserServiceType = Symbol('IUserService');
