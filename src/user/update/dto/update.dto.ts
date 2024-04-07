import { IntersectionType, PickType } from '@nestjs/swagger';
import { UserEntity } from '../../entities/user.entity';
import { UserEditableDto } from '../../dto/user-editable.dto';

export class UpdateDto extends IntersectionType(
  UserEditableDto,
  PickType(UserEntity, ['id'] as const),
) {
  constructor(partial?: Partial<UpdateDto>) {
    super();
    if (partial) Object.assign(this, partial);
  }
}
