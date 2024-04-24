import { IsString } from 'class-validator';

export class LoginRequirementCreateVo {
  @IsString()
  username: string;

  @IsString()
  psw: string;
}
