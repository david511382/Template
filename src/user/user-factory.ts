import { Injectable } from '@nestjs/common';
import { IPswHash } from './interface/psw-hash.interface';
import { UserDo } from './do/user.do';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserFactory {
  constructor(private readonly _pswHash: IPswHash) {}

  create(partial?: Partial<UserEntity>): UserDo {
    return new UserDo(this._pswHash, partial);
  }
}
