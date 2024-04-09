import { Expose } from 'class-transformer';

export class RemoveConnectionDto {
  @Expose()
  id: bigint;
}
