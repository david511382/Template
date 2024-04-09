import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class DenyVo {
  @Expose({})
  @IsNotEmpty()
  @Transform(({ value }) => BigInt(value))
  id: bigint;
}
