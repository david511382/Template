import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequirementCreateVo {
  @IsString()
  @IsNotEmpty({ message: '請輸入帳號' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: '請輸入密碼' })
  psw: string;
}
