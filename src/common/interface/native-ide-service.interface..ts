import { Response } from '../response';
import { IdeServiceLoginDto as OtpDto } from '../../login/dto/ide-service-login.dto';
import { IdeServiceLoginDto } from '../../auth/dto/ide-service-login.dto';

export interface INativeIdeService {
  login(dto: IdeServiceLoginDto): Promise<Response<boolean>>;
  otpLogin(dto: OtpDto): Promise<Response<boolean>>;
}

export const INativeIdeServiceType = Symbol('INativeIdeService');
