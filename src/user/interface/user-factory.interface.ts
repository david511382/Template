import { UserDo } from '../do/user.do';
import { UserEntity } from '../entities/user.entity';

export interface IUserFactory {
  create(partial?: Partial<UserEntity>): UserDo;
}

export const IUserFactoryType = Symbol('IUserFactory');
