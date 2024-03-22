import { IsExistDto } from './is-exist.dto';

export class IsExistStorageDto extends IsExistDto {
  constructor(partial?: Partial<IsExistStorageDto>) {
    super();
    if (partial) Object.assign(this, partial);
  }
}
