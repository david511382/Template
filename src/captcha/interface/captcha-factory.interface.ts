import { Response } from '../../common/response';
import { Captcha } from '../entities/captcha.entity';

export interface ICaptchaFactory {
  create(): Promise<Response<Captcha>>;
}

export const ICaptchaFactoryType = Symbol('ICaptchaFactory');
