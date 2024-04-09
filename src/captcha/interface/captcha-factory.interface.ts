import { Response } from '../../common/entities/response.entity';
import { Captcha } from '../entities/captcha.entity';

export interface ICaptchaFactory {
  create(): Promise<Response<Captcha>>;
}

export const ICaptchaFactoryType = Symbol('ICaptchaFactory');
