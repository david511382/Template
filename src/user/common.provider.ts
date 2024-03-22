import { IUserFactoryType } from './interface/user-factory.interface';
import { UserFactory } from './user-factory';

export const commonProviders = [
  {
    provide: IUserFactoryType,
    useClass: UserFactory,
  },
];
