import { Expose, Transform, Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginRequirementCreateVo {
  @IsString()
  @Expose({ name: 'username' })
  @IsNotEmpty({ message: '請輸入帳號' })
  username: string;

  @IsString()
  @Expose({ name: 'otp' })
  @IsNotEmpty({ message: '請輸入OTP' })
  otp: string;

  @IsString()
  @Expose({ name: 'psw' })
  @IsNotEmpty({ message: '請輸入密碼' })
  psw: string;

  @IsString()
  @Expose({ name: 'description' })
  @IsNotEmpty({ message: '請輸入登入原因說明' })
  description: string;

  @IsDate()
  @Expose({ name: 'connect_time' })
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @IsOptional()
  connectTime?: Date;

  @IsString()
  @Expose({})
  code?: string;
}
