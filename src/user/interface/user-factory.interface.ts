import { User, UserEntity } from '../entities/utm.entity';

export interface IUserFactory {
  create( partial?: Partial<UserEntity>): User 
}

export const IUserFactoryType = Symbol('IUserFactory');
