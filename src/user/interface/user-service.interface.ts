import { Response } from '../../common/response';
import { UpdateDto } from '../dto/update.dto';
import { UserDo } from '../do/user.do';
import { FindDto } from '../dto/find.dto';

export interface IUserService  {
  isExsitAsync(user: UserDo): Promise<Response<boolean>>;
  createAsync(user: UserDo): Promise<Response<UserDo>>;
  findAsync(dto: FindDto): Promise<Response<UserDo>>;
  updateAsync(dto: UpdateDto): Promise<Response<void>>;
}

export const IUserServiceType = Symbol('IUserService');
