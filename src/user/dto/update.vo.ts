import { OmitType } from '@nestjs/swagger';
import { UpdateDto } from './update.dto';

export class UpdateVo extends UpdateDto{
  constructor(partial?: Partial<UpdateVo>) {
    super(partial);
  }
}
