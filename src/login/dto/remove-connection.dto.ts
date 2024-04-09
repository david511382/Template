import { Expose } from 'class-transformer';

export class RemoveConnectionDto {
  @Expose({ name: 'username' })
  username: string;
}
