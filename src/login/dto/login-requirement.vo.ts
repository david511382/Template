import { Expose } from 'class-transformer';

export class LoginRequirementVo {
  @Expose({ name: 'id' })
  get clientId(): string {
    return this.id.toString();
  }
  id: bigint;

  @Expose({ name: 'username' })
  username: string;

  @Expose({ name: 'ip' })
  ip: string;

  @Expose({ name: 'description' })
  description: string;

  @Expose({ name: 'request_time' })
  requestTime: Date;

  @Expose({ name: 'connect_time' })
  connectTime: Date;

  constructor(partial?: Partial<LoginRequirementVo>) {
    if (partial) Object.assign(this, partial);
  }
}
