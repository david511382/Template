import { PickType } from '@nestjs/swagger';
import { AccountServiceDto } from './user-service.dto';

export class AccountTokenDto extends PickType(AccountServiceDto, [
  'id',
  'email',
] as const) {
  constructor(partial?: Partial<AccountTokenDto>) {
    super();
    if (partial) Object.assign(this, partial);
  }
}
