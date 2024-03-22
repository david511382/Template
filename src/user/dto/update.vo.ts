import { OmitType } from '@nestjs/swagger';
import { UpdateDto } from './update.dto';

export class UpdateVo extends OmitType(UpdateDto, ['id'] as const) {
  constructor(partial?: Partial<UpdateVo>) {
    super(partial);
  }
}
