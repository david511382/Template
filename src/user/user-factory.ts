import { Injectable, Inject } from '@nestjs/common';
import { IPswHashType, IPswHash } from './interface/psw-hash.interface';
import { IUserFactory } from './interface/user-factory.interface';
import { UserDo } from './do/user.do';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserFactory implements IUserFactory {
  constructor(@Inject(IPswHashType) private readonly _pswHash: IPswHash) {}

  create(partial?: Partial<UserEntity>): UserDo {
    return new UserDo(this._pswHash, partial);
  }
}
