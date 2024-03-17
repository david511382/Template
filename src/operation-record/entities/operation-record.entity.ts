import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { IsDate, IsEmail, IsEnum, IsNumber, IsString } from 'class-validator';
import { OperatorCodeEnum } from '../enum/operation-record.enum';

class OperationRecordProps {
  @IsNumber()
  id: bigint;

  @IsEmail()
  operatorEmail: string;

  @IsEnum(OperatorCodeEnum)
  operatorCode: OperatorCodeEnum;

  @IsDate()
  // @Type(() => Date)
  operatorTime: Date;

  @IsString()
  message: string;

  constructor(partial?: Partial<OperationRecordProps>) {
    if (partial) {
      const data = plainToInstance(OperationRecordProps, partial);
      Object.assign(this, data);
    }
  }
}

@Exclude()
export class OperationRecord {
  private _props: OperationRecordProps;

  constructor(partial?: Partial<OperationRecordProps>) {
    this._props = new OperationRecordProps(partial);
  }

  @IsNumber()
  @Expose({ name: 'id', groups: ['store', 'client'] })
  get id(): bigint {
    return this._props.id;
  }

  @IsEmail()
  @Expose({ name: 'operator_email', groups: ['store', 'client'] })
  get operatorEmail(): string {
    return this._props.operatorEmail;
  }

  @IsEnum(OperatorCodeEnum)
  @Expose({ name: 'operator_code', groups: ['store', 'client'] })
  get operatorCode(): OperatorCodeEnum {
    return this._props.operatorCode;
  }

  @IsDate()
  // @Type(() => Date)
  @Expose({ name: 'operator_time', groups: ['store'] })
  get operatorTime(): Date {
    return this._props.operatorTime;
  }
  @Expose({ name: 'operator_time', groups: ['client'] })
  get formatedOperatorTime(): string {
    return this.operatorTime.toLocaleTimeString();
  }

  @IsString()
  @Expose({ name: 'message', groups: ['client'] })
  get message(): string {
    return this._props.message;
  }
}
