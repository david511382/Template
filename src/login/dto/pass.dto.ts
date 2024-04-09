import { PickType } from '@nestjs/swagger';
import { SetDto } from './login-requirement-set.dto';

export class PassDto extends PickType(SetDto, [
  'id',
  'applyUsername',
] as const) {}
