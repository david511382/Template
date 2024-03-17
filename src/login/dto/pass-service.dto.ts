import { PickType } from '@nestjs/swagger';
import { SetServiceDto } from './set-service.dto';

export class PassServiceDto extends PickType(SetServiceDto, [
  'username' as const,
]) {}
