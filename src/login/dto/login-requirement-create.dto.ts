import { Expose } from 'class-transformer';

export class LoginRequirementCreateDto {
  username: string;

  psw: string;

  otp: string;

  description: string;

  ip: string;

  @Expose({ name: 'connect_time' })
  connectTime?: Date;
}
