import { UserEntity } from '../../user/entities/utm.entity';
import { PickType } from '@nestjs/swagger';

export class AccountTokenDto extends PickType(UserEntity, [
  'id',
  'email',
] as const) {
  constructor(partial?: Partial<AccountTokenDto>) {
    super();
    if (partial) Object.assign(this, partial);
  }
}
