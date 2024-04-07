import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../../user/entities/user.entity';

export class UserTokenDto extends PickType(UserEntity, [
  'id',
  'email',
] as const) {
  constructor(partial?: Partial<UserTokenDto>) {
    super();
    if (partial) Object.assign(this, partial);
  }
}
