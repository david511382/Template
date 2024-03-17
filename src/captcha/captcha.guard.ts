import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import {
  IS_IGNORE_CAPTCHA_KEY,
  IS_PUBLIC_KEY,
} from '../infra/http/decorator/public.decorator';
import { Request } from 'express';
import { ErrorCode } from '../common/error/error-code.enum';
import { CaptchaService } from './captcha.service';
import { AnswerServiceDto } from './dto/answer.dto';

@Injectable()
export class CaptchaGuard implements CanActivate {
  constructor(
    private readonly _moduleRef: ModuleRef,
    private _reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this._reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!isPublic) {
      return true;
    }
    const isIgnoreCaptcha = this._reflector.getAllAndOverride<boolean>(
      IS_IGNORE_CAPTCHA_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isIgnoreCaptcha) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const captcha = this.extractCaptcahFromHeader(request);
    if (!captcha.id) {
      throw new HttpException('驗證碼錯誤', HttpStatus.BAD_REQUEST);
    }

    const captchaService =
      await this._moduleRef.resolve<CaptchaService>(CaptchaService);

    const verifyAsyncRes = await captchaService.verifyAsync(captcha);
    if (
      verifyAsyncRes.errorCode != ErrorCode.SUCCESS ||
      !verifyAsyncRes.results
    ) {
      throw new HttpException('驗證碼錯誤', HttpStatus.BAD_REQUEST);
    }

    return true;
  }

  private extractCaptcahFromHeader(request: Request): AnswerServiceDto {
    const [id, code] = request.headers.captcha?.toString().split(':') ?? [];
    const answer: AnswerServiceDto = {
      id,
      code,
    };
    return answer;
  }
}
