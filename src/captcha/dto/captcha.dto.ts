import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class CaptchaDto {
  @Expose()
  @IsString()
  html: string;

  @Expose()
  @IsString()
  code: string;
}
