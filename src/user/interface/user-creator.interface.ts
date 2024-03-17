import { User } from '../entities/user.entity';

export interface IUserCreator {
  newUser(id?: number, user?: User): User;
}

export const IUserCreatorType = Symbol('IUserCreator');
