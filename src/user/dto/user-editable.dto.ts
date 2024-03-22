import { OmitType } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';
import { Expose } from 'class-transformer';
import { IsString, MinLength } from 'class-validator';
import { PASSWORD_MIN_LEN } from '../const/user-constraint.const';

export class UserEditableDto extends OmitType(UserEntity, [
  'id',
  'email',
] as const) {
  constructor(partial?: Partial<UserEditableDto>) {
    super();
    if (partial) Object.assign(this, partial);
  }

  @IsString()
  @Expose()
  @MinLength(PASSWORD_MIN_LEN)
  password: string;
}
