import { IsDate, IsNumber, IsString } from 'class-validator';

export class QueryableOperationRecordDto {
  @IsNumber()
  id: number;

  @IsString()
  likesMessage: string;

  @IsDate()
  // @Type(() => Date)
  fromOperatorTime: Date;

  @IsDate()
  // @Type(() => Date)
  toOperatorTime: Date;

  @IsDate()
  // @Type(() => Date)
  afterOperatorTime: Date;

  @IsDate()
  // @Type(() => Date)
  beforeOperatorTime: Date;

  constructor(partial?: Partial<QueryableOperationRecordDto>) {
    if (partial) Object.assign(this, partial);
  }
}
