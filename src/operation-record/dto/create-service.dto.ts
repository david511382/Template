import { PickType } from '@nestjs/swagger';
import { OperationRecord } from '../entities/operation-record.entity';

export class CreateServiceDto extends PickType(OperationRecord, [
  'operatorCode',
  'message',
  'operatorEmail',
] as const) {
  constructor(partial?: Partial<CreateServiceDto>) {
    super();
    if (partial) Object.assign(this, partial);
  }
}
