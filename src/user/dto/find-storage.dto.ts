import { FindDto } from './find.dto';

export class FindStorageDto extends FindDto {
  constructor(partial?: Partial<FindStorageDto>) {
    super();
    if (partial) Object.assign(this, partial);
  }
}
