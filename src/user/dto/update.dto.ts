import { OmitType } from '@nestjs/swagger';
import { UpdateServiceDto } from './update-servive.dto';

export class UpdateDto extends OmitType(UpdateServiceDto, ['id'] as const) {
  constructor(partial?: Partial<UpdateDto>) {
    super(partial);
  }
}
