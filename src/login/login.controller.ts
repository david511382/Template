import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Ip,
  Param,
  Post,
} from '@nestjs/common';
import { ErrorCode } from '../common/error/error-code.enum';
import { LoginService } from './login.service';
import { plainToClassFromExist, plainToInstance } from 'class-transformer';
import { LoginServiceDto } from './dto/login-service.dto';
import { LoginDto } from './dto/login.dto';
import { Internal, Public } from '../infra/http/decorator/public.decorator';
import { PassServiceDto } from './dto/pass-service.dto';
import { RemoveConnectionServiceDto } from './dto/remove-connection-service.dto';
import { GlobalValidationPipe } from '../infra/http/pipe/validation.pipe';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Get('requirement')
  @HttpCode(HttpStatus.OK)
  async get() {
    const getRes = await this.loginService.get();
    switch (getRes.errorCode) {
      case ErrorCode.SUCCESS:
        break;
      default:
        throw new HttpException(getRes.msg, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return getRes.results;
  }

  @Public()
  @Post('requirement')
  @HttpCode(HttpStatus.OK)
  async create(@Body(GlobalValidationPipe) body: LoginDto, @Ip() ip: string) {
    let dto = plainToInstance(LoginServiceDto, body);
    dto = plainToClassFromExist(dto, { ip });
    const loginRes = await this.loginService.create(dto);
    switch (loginRes.errorCode) {
      case ErrorCode.SUCCESS:
        break;
      case ErrorCode.LOGIN_REQUIRED:
        throw new HttpException(loginRes.msg, HttpStatus.BAD_REQUEST);
      case ErrorCode.LOGIN_FAIL:
        throw new HttpException(loginRes.msg, HttpStatus.UNAUTHORIZED);
      case ErrorCode.TIMEOUT:
        throw new HttpException(loginRes.msg, HttpStatus.GATEWAY_TIMEOUT);
      default:
        throw new HttpException(loginRes.msg, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('requirement/:username')
  @HttpCode(HttpStatus.OK)
  async pass(@Param() param) {
    let dto = new PassServiceDto();
    dto = Object.assign(dto, param);
    const passRes = await this.loginService.pass(dto);
    switch (passRes.errorCode) {
      case ErrorCode.SUCCESS:
        break;
      case ErrorCode.NOT_FOUND:
        throw new HttpException(passRes.msg, HttpStatus.BAD_REQUEST);
      case ErrorCode.TIMEOUT:
        throw new HttpException(passRes.msg, HttpStatus.GATEWAY_TIMEOUT);
      case ErrorCode.SETTING_FAIL:
      default:
        throw new HttpException(passRes.msg, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return passRes.results;
  }

  @Delete('requirement/:username')
  @HttpCode(HttpStatus.OK)
  async deny(@Param() param) {
    let dto = new PassServiceDto();
    dto = Object.assign(dto, param);
    const denyRes = await this.loginService.deny(dto);
    switch (denyRes.errorCode) {
      case ErrorCode.SUCCESS:
        break;
      case ErrorCode.NOT_FOUND:
        throw new HttpException(denyRes.msg, HttpStatus.BAD_REQUEST);
      case ErrorCode.TIMEOUT:
        throw new HttpException(denyRes.msg, HttpStatus.GATEWAY_TIMEOUT);
      case ErrorCode.SETTING_FAIL:
      default:
        throw new HttpException(denyRes.msg, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return denyRes.results;
  }

  @Internal()
  @Delete('connection/:username')
  @HttpCode(HttpStatus.OK)
  async removeConnection(@Param() param) {
    let dto = new RemoveConnectionServiceDto();
    dto = Object.assign(dto, param);
    const removeConnectionAsyncRes =
      await this.loginService.removeConnectionAsync(dto);
    switch (removeConnectionAsyncRes.errorCode) {
      case ErrorCode.SUCCESS:
        break;
      case ErrorCode.TIMEOUT:
        throw new HttpException(
          removeConnectionAsyncRes.msg,
          HttpStatus.GATEWAY_TIMEOUT,
        );
      case ErrorCode.SETTING_FAIL:
      default:
        throw new HttpException(
          removeConnectionAsyncRes.msg,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }
}
