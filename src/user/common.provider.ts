import { UserFactory } from './user-factory';
import { IPswHash, IPswHashType } from './interface/psw-hash.interface';
import { PswHash } from '../infra/util/psw-hash';
import { Provider } from '@nestjs/common';

export const commonProviders: Provider[] = [
  {
    provide: IPswHashType,
    useClass: PswHash,
  },
  {
    provide: UserFactory,
    useFactory: (pswHash: IPswHash) => {
      return new UserFactory(pswHash);
    },
    inject: [{ token: IPswHashType, optional: false }],
  },
];
