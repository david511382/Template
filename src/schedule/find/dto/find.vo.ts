import { Expose } from 'class-transformer';

export class FindVo {
  @Expose({})
  name: string;
}
