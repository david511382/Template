import { Expose } from 'class-transformer';

export class SetServiceDto {
  @Expose({ name: 'username' })
  username: string;

  approval: boolean;
}
