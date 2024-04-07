import { Injectable } from '@nestjs/common';
import { IPswHash } from './interface/psw-hash.interface';
import { UserDo } from './do/user.do';
import { UserEntity } from './entities/user.entity';
import { UtmEntity } from './entities/utm.entity';

@Injectable()
export class UserFactory {
  constructor(private readonly _pswHash: IPswHash) { }

  create(userPartial?: Partial<UserEntity>,
    utmPartial?: Partial<UtmEntity>): UserDo {
    return new UserDo(this._pswHash, userPartial, utmPartial);
  }
}
