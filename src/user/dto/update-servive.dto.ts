import { OmitType } from '@nestjs/swagger';
import { UserProps } from '../entities/user.entity';

export class UpdateServiceDto extends OmitType(UserProps, [
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
