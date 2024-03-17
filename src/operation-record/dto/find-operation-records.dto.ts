import { PageDto } from './page.dto';
import { QueryableOperationRecordDto } from './queryable-operation-record.dto';

export class FindOperationRecordsDto {
  page: PageDto;

  props: QueryableOperationRecordDto;

  constructor(partial?: Partial<QueryableOperationRecordDto>) {
    if (partial) Object.assign(this, partial);
  }
}
