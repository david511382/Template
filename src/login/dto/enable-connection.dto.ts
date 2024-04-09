import { Expose } from 'class-transformer';
import { RemoveConnectionDto } from './remove-connection.dto';

export class EnableConnectionDto extends RemoveConnectionDto {
  @Expose()
  id: bigint;
}
