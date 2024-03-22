import { Expose, Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { GenderEnum } from '../enum/gender.enum';
import { EntityExposeEnum } from '../../common/enum/expose.enum';

export class UserEntity {
  constructor(partial?: Partial<UserEntity>) {
    if (partial) Object.assign(this, partial);
  }

  @IsNumber()
  @Expose({ groups: [EntityExposeEnum.Store, EntityExposeEnum.Load] })
  id: number;

  @IsEmail()
  @Expose({ groups: [EntityExposeEnum.Store, EntityExposeEnum.Load] })
  @MaxLength(128)
  email: string;

  @IsString()
  @Expose({
    name: 'first_name',
    groups: [EntityExposeEnum.Store, EntityExposeEnum.Load],
  })
  @MaxLength(16)
  firstName: string;

  @IsString()
  @Expose({
    name: 'last_name',
    groups: [EntityExposeEnum.Store, EntityExposeEnum.Load],
  })
  @MaxLength(16)
  lastName: string;

  @IsEnum(GenderEnum)
  @Expose({ groups: [EntityExposeEnum.Store, EntityExposeEnum.Load] })
  gender: GenderEnum;

  @IsString()
  @Expose({ groups: [EntityExposeEnum.Store, EntityExposeEnum.Load] })
  @MaxLength(64)
  password: string;

  @IsDate()
  @Expose({ groups: [EntityExposeEnum.Store, EntityExposeEnum.Load] })
  birthday: Date;
}
