import { OmitType } from '@nestjs/swagger';
import { UpdateDto } from './update.dto';

export class UpdateVo extends OmitType(UpdateDto, ['id'] as const) {
  constructor(partial?: Partial<UpdateVo>) {
    super(partial);
  }

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
