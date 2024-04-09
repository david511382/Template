import { PickType } from '@nestjs/swagger';
import { SetDto } from './login-requirement-set.dto';

export class DenyDto extends PickType(SetDto, [
  'id',
  'applyUsername',
] as const) {}
