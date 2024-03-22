import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../../user/entities/user.entity';

export class AccountTokenDto extends PickType(UserEntity, [
  'id',
  'email',
] as const) {
  constructor(partial?: Partial<AccountTokenDto>) {
    super();
    if (partial) Object.assign(this, partial);
  }
}
