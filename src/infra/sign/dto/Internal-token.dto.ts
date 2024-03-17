import { Expose } from 'class-transformer';

export class InternalTokenDto {
  @Expose({ name: 'key' })
  key: string;
}
