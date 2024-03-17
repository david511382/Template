import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class AnswerServiceDto {
  @Expose()
  @IsString()
  id: string;

  @Expose()
  @IsString()
  code: string;
}
