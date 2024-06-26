import {
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CaptchaService } from './captcha.service';
import { ErrorCode } from '../common/error/error-code.enum';
import { Public } from '../infra/http/metadata';
import { QuestionDto } from './dto/question.dto';

@Controller('captcha')
export class CaptchaController {
  constructor(private readonly _captchaService: CaptchaService) {}

  @Public(true)
  @Post()
  @HttpCode(HttpStatus.OK)
  async create() {
    let captcha: QuestionDto;
    {
      const createAsyncRes = await this._captchaService.createAsync();
      switch (createAsyncRes.errorCode) {
        case ErrorCode.SUCCESS:
          captcha = createAsyncRes.results;
          break;
        default:
          throw new HttpException(
            ErrorCode.SYSTEM_FAIL,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }

    return captcha;
  }
}
