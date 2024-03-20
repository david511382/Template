import { Expose } from 'class-transformer';
import { OperatorCodeEnum } from '../enum/operation-record.enum';
import { OperationRecordEntity } from '../entities/operation-record.entity';

export class OperationRecordDo {
  private _entity: OperationRecordEntity;

  constructor(partial?: Partial<OperationRecordEntity>) {
    this._entity = new OperationRecordEntity(partial);
  }

  @Expose()
  get id(): bigint {
    return this._entity.id;
  }

  @Expose()
  get username(): string {
    return this._entity.username;
  }

  @Expose({ name: 'operator_code' })
  get operatorCode(): OperatorCodeEnum {
    return this._entity.operatorCode;
  }

  get operatorTime(): Date {
    return this._entity.operatorTime;
  }

  @Expose({ name: 'operator_time' })
  get formatedOperatorTime(): string {
    return this.operatorTime.toLocaleTimeString();
  }

  @Expose()
  get message(): string {
    return this._entity.message;
  }

  get entity(): OperationRecordEntity {
    return this._entity;
  }
}
