import { Expose } from 'class-transformer';

export class RemoveConnectionServiceDto {
  @Expose({ name: 'username' })
  username: string;
}
