import { PickType } from '@nestjs/swagger';
import { OperationRecordEntity } from '../entities/operation-record.entity';

export class CreateServiceDto extends PickType(OperationRecordEntity, [
  'operatorCode',
  'message',
  'username',
  'operatorTime',
] as const) {
  constructor(partial?: Partial<CreateServiceDto>) {
    super();
    if (partial) Object.assign(this, partial);
  }
}
