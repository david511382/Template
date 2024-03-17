import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Ip,
  Post,
} from '@nestjs/common';
import { ErrorCode } from '../common/error/error-code.enum';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { Public } from '../infra/http/decorator/public.decorator';
import { GlobalValidationPipe } from '../infra/http/pipe/validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body(GlobalValidationPipe) body: LoginDto, @Ip() ip: string) {
    const dto = { ip, ...body };
    const loginRes = await this.authService.login(dto);
    switch (loginRes.errorCode) {
      case ErrorCode.SUCCESS:
        return loginRes.results;
      case ErrorCode.LOGIN_FAIL:
        throw new HttpException(loginRes.msg, HttpStatus.UNAUTHORIZED);
      case ErrorCode.TIMEOUT:
        throw new HttpException(loginRes.msg, HttpStatus.GATEWAY_TIMEOUT);
      default:
        throw new HttpException(loginRes.msg, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verify() {}
}
