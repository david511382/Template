import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class AccountTokenDto {
  @Expose()
  @IsString()
  username: string;
}
