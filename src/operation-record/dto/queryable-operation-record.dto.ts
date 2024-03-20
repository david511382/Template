import { IsDate, IsNumber, IsString } from 'class-validator';

export class QueryableOperationRecordDto {
  @IsNumber()
  id: number;

  @IsString()
  likesMessage: string;

  @IsDate()
  fromOperatorTime: Date;

  @IsDate()
  toOperatorTime: Date;

  @IsDate()
  afterOperatorTime: Date;

  @IsDate()
  beforeOperatorTime: Date;

  constructor(partial?: Partial<QueryableOperationRecordDto>) {
    if (partial) Object.assign(this, partial);
  }
}
