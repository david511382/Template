import { Expose } from 'class-transformer';

export class LoginRequirementDto {
  @Expose({ name: 'username' })
  username: string;

  @Expose({ name: 'ip' })
  ip: string;

  @Expose({ name: 'description' })
  description: string;

  @Expose({ name: 'request_time' })
  requestTime: string;
}
