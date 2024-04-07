import { OmitType } from '@nestjs/swagger';
import { UpdateDto } from './update.dto';
import { Expose } from 'class-transformer';
import { IsString, IsEnum, IsDate } from 'class-validator';
import { GenderEnum } from '../../enum/gender.enum';

export class UpdateVo extends OmitType(UpdateDto, ['id'] as const) {
  constructor(partial?: Partial<UpdateVo>) {
    super(partial);
  }

  @IsString()
  @Expose({ name: 'first_name' })
  firstName: string;

  @Expose({ name: 'last_name' })
  lastName: string;

  @IsEnum(GenderEnum)
  @Expose({})
  gender: GenderEnum;

  @IsString()
  @Expose({})
  password: string;

  @IsDate()
  @Expose({})
  birthday: Date;
}
