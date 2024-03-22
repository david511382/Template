import { Expose } from 'class-transformer';
import { IsString, MaxLength } from 'class-validator';
import { EntityExposeEnum } from '../../common/enum/expose.enum';

export class UtmEntity {
  constructor(partial?: Partial<UtmEntity>) {
    if (partial) Object.assign(this, partial);
  }

  @IsString()
  @Expose({ name: 'campaign', groups: [EntityExposeEnum.Store, 'client'] })
  @MaxLength(16)
  campaign: string;

  @IsString()
  @Expose({ name: 'medium', groups: [EntityExposeEnum.Store, 'client'] })
  @MaxLength(16)
  medium: string;

  @IsString()
  @Expose({ name: 'source', groups: [EntityExposeEnum.Store, 'client'] })
  @MaxLength(16)
  source: string;
}
