import { Expose } from 'class-transformer';

export class SetVo {
  @Expose({})
  username: string;

  @Expose({ name: 'end_time' })
  endTime?: Date;

  constructor(partial?: Partial<SetVo>) {
    if (partial) Object.assign(this, partial);
  }
}
