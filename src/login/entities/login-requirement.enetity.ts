import { Expose, plainToInstance } from 'class-transformer';
import {
  IsNumber,
  IsString,
  MaxLength,
  IsDate,
  IsBoolean,
} from 'class-validator';
import { EntityExposeEnum } from '../../common/enum/expose.enum';
import { CODE_MAX_LENGTH, Constrains } from '../do/login-requirement.do';

export class LoginRequirementEntity {
  @IsNumber()
  @Expose({})
  id: bigint;

  @IsString()
  @Expose({})
  username: string;

  @IsString()
  @Expose({})
  description: string;

  @IsString()
  @Expose({})
  @MaxLength(15)
  ip: string;

  @IsDate()
  @Expose({ name: 'request_time' })
  requestTime: Date;

  @IsDate()
  @Expose({ name: 'request_date' })
  requestDate: Date;

  @IsString()
  @Expose({ name: 'apply_username' })
  applyUsername: string;

  @IsDate()
  @Expose({ name: 'apply_time' })
  applyTime: Date;

  @IsDate()
  @Expose({ name: 'apply_date' })
  applyDate: Date;

  @IsBoolean()
  @Expose({ groups: [EntityExposeEnum.Create] })
  get approval(): boolean {
    return this.storeApproval > 0;
  }
  set approval(b: boolean) {
    this.storeApproval = b ? 1 : 0;
  }
  @IsNumber()
  @Expose({
    name: 'approval',
    groups: [EntityExposeEnum.Store, EntityExposeEnum.Load],
  })
  storeApproval: number;

  @IsDate()
  @Expose({ name: 'connect_time' })
  connectTime: Date;

  @IsString()
  @Expose({})
  @MaxLength(CODE_MAX_LENGTH)
  code?: string;

  constructor(partial?: Partial<LoginRequirementEntity>) {
    if (partial) {
      const data = plainToInstance(LoginRequirementEntity, partial, {
        groups: [EntityExposeEnum.Create],
      });
      Object.assign(this, data);
    }
  }
}
