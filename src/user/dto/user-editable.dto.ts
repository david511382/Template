import { IntersectionType, OmitType } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class UserEditableDto extends IntersectionType (UserEntity, [
  'id',
  'email',
  'utmCampaign',
  'utmMedium',
  'utmSource',
] as const) {
  constructor(partial?: Partial<UserEditableDto>) {
    super();
    if (partial) Object.assign(this, partial);
  }
}
