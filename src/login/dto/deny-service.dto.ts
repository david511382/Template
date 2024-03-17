import { PickType } from '@nestjs/swagger';
import { SetServiceDto } from './set-service.dto';

export class DenyServiceDto extends PickType(SetServiceDto, [
  'username' as const,
]) {}
