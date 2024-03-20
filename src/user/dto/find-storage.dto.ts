import { FindServiceDto } from "./find-service.dto";

export class FindStorageDto extends FindServiceDto{
  constructor(partial?: Partial<FindStorageDto>) {
    super();
    if (partial) Object.assign(this, partial);
  }
}
