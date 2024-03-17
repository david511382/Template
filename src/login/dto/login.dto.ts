import { Expose } from 'class-transformer';

export class LoginDto {
  @Expose({ name: 'username' })
  username: string;

  @Expose({ name: 'otp' })
  otp: string;

  @Expose({ name: 'psw' })
  psw: string;

  @Expose({ name: 'description' })
  description: string;
}
