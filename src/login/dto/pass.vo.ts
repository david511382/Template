import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class PassVo {
  @Expose({})
  @IsNotEmpty()
  @Transform(({ value }) => BigInt(value))
  id: bigint;
}
