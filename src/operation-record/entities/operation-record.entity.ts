import { Expose, plainToInstance } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';
import { OperatorCodeEnum } from '../enum/operation-record.enum';
import { EntityExposeEnum } from '../../common/enum/expose.enum';

export class OperationRecordEntity {
  @IsNumber()
  @Expose({ groups: [EntityExposeEnum.Store, EntityExposeEnum.Load] })
  id: bigint;

  @IsString()
  @Expose({ groups: [EntityExposeEnum.Store, EntityExposeEnum.Load] })
  username: string;

  @IsEnum(OperatorCodeEnum)
  @Expose({ name: 'operator_code', groups: [EntityExposeEnum.Store, EntityExposeEnum.Load] })
  operatorCode: OperatorCodeEnum;

  @IsDate()
  @Expose({ name: 'operator_time', groups: [EntityExposeEnum.Store, EntityExposeEnum.Load] })
  operatorTime: Date;

  @IsString()
  @Expose({ groups: [EntityExposeEnum.Store, EntityExposeEnum.Load] })
  message: string;

  constructor(partial?: Partial<OperationRecordEntity>) {
    if (partial) {
      const data = plainToInstance(OperationRecordEntity, partial);
      Object.assign(this, data);
    }
  }
}
