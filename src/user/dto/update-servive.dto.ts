import { OmitType } from '@nestjs/swagger';
import { UserEntity } from '../entities/utm.entity';

export class UpdateServiceDto extends OmitType(UserEntity, [
  'email',
  'birthday',
  'utmCampaign',
  'utmMedium',
  'utmSource',
] as const) {
  constructor(partial?: Partial<UpdateServiceDto>) {
    super();
    if (partial) Object.assign(this, partial);
  }
}
