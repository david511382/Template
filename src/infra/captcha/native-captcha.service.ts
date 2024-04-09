import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { Captcha } from '../../captcha/entities/captcha.entity';
import {
  IIdFactory,
  IIdFactoryType,
} from '../../common/interface/id-factory.interface';
import { Response, newResponse } from '../../common/entities/response.entity';
import { IRequestLoggerServiceType } from '../log/interface/logger.interface';
import { ErrorCode } from '../../common/error/error-code.enum';
import { ICaptchaFactory } from '../../captcha/interface/captcha-factory.interface';
// https://github.com/produck/svg-captcha?tab=readme-ov-file
const svgCaptcha = require('svg-captcha');

@Injectable()
export class NativeCaptchaService implements ICaptchaFactory {
  constructor(
    @Inject(IRequestLoggerServiceType) private readonly _logger: LoggerService,
    @Inject(IIdFactoryType) private readonly _idFactory: IIdFactory,
  ) {}

  async create(): Promise<Response<Captcha>> {
    const res = newResponse<Captcha>();

    try {
      const captcha = svgCaptcha.createMathExpr({
        mathMin: 1,
        mathMax: 10,
        mathOperator: '+',
        width: 125,
        height: 40,
      });
      const code = captcha.text;
      const html = captcha.data;
      res.results = new Captcha(this._idFactory, {
        html,
        code,
      });
    } catch (e) {
      this._logger.error(e);
      res.setMsg(ErrorCode.SYSTEM_FAIL);
    } finally {
      return res;
    }
  }
}
