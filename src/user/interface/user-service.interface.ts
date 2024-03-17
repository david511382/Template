import { Response } from '../../common/response';
import { UpdateServiceDto } from '../../user/dto/update-servive.dto';
import {
  User,
  QueryableUserProps,
} from '../../user/entities/user.entity';
import { IUserCreator } from './user-creator.interface';

export interface IUserService extends IUserCreator {
  isExsitAsync(user: User): Promise<Response<boolean>>;
  createAsync(user: User): Promise<Response<User>>;
  findAsync(dto: QueryableUserProps): Promise<Response<User>>;
  updateAsync(dto: UpdateServiceDto): Promise<Response<void>>;
}

export const IUserServiceType = Symbol('IUserService');
