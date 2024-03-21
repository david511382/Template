import {  OmitType } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class UserEditableDto extends OmitType (UserEntity, [
  'id',
] as const) {
  constructor(partial?: Partial<UserEditableDto>) {
    super();
    if (partial) Object.assign(this, partial);
  }
}
