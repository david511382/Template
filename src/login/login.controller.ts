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
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { LoginRequirementCreateDto } from './dto/login-requirement-create.dto';
import { LoginRequirementCreateVo } from './dto/login-requirement-create.vo';
import {
  Internal,
  Public,
  RecordOperation,
} from '../infra/http/decorator/public.decorator';
import { PassDto } from './dto/pass.dto';
import { RemoveConnectionDto } from './dto/remove-connection.dto';
import { GlobalValidationPipe } from '../infra/http/pipe/validation.pipe';
import { OperatorCodeEnum } from '../operation-record/enum/operation-record.enum';
import { AccountTokenDto } from '../auth/dto/account-token.dto';
import { User } from '../auth/user.decorator';
import { EnableConnectionDto } from './dto/enable-connection.dto';
import { DenyDto } from './dto/deny.dto';
import { DenyVo } from './dto/deny.vo';
import { PassVo } from './dto/pass.vo';

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
  async create(
    @Body(GlobalValidationPipe) body: LoginRequirementCreateVo,
    @Ip() ip: string,
  ) {
    let res;
    {
      let dto = plainToInstance(LoginRequirementCreateDto, body);
      dto = Object.assign(dto, { ip });
      const createRes = await this.loginService.create(dto);
      switch (createRes.errorCode) {
        case ErrorCode.SUCCESS:
          res = createRes.results;
          break;
        case ErrorCode.EXISTING:
          throw new HttpException(
            ErrorCode.CONNECT_OVERLAP,
            HttpStatus.BAD_REQUEST,
          );
        case ErrorCode.LOGIN_FAIL:
          throw new HttpException(createRes.msg, HttpStatus.UNAUTHORIZED);
        case ErrorCode.TIMEOUT:
          throw new HttpException(createRes.msg, HttpStatus.GATEWAY_TIMEOUT);
        default:
          throw new HttpException(
            createRes.msg,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }

    return res;
  }

  @RecordOperation(OperatorCodeEnum.PassLoginRequirement)
  @Post('requirement/:id')
  @HttpCode(HttpStatus.OK)
  async pass(
    @Param(GlobalValidationPipe) param: PassVo,
    @User() user: AccountTokenDto,
  ) {
    const plain = instanceToPlain(param, { excludeExtraneousValues: true });
    const dto = plainToInstance(PassDto, plain);
    dto.applyUsername = user.username;
    const passRes = await this.loginService.pass(dto);
    switch (passRes.errorCode) {
      case ErrorCode.SUCCESS:
        return passRes.results;
      case ErrorCode.NOT_FOUND:
        throw new HttpException(passRes.msg, HttpStatus.BAD_REQUEST);
      case ErrorCode.TIMEOUT:
        throw new HttpException(passRes.msg, HttpStatus.GATEWAY_TIMEOUT);
      case ErrorCode.SETTING_FAIL:
      default:
        throw new HttpException(passRes.msg, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @RecordOperation(OperatorCodeEnum.DenyLoginRequirement)
  @Delete('requirement/:id')
  @HttpCode(HttpStatus.OK)
  async deny(
    @Param(GlobalValidationPipe) param: DenyVo,
    @User() user: AccountTokenDto,
  ) {
    const plain = instanceToPlain(param, { excludeExtraneousValues: true });
    const dto = plainToInstance(DenyDto, plain);
    dto.applyUsername = user.username;
    const denyRes = await this.loginService.deny(dto);
    switch (denyRes.errorCode) {
      case ErrorCode.SUCCESS:
        return denyRes.results;
      case ErrorCode.NOT_FOUND:
        throw new HttpException(denyRes.msg, HttpStatus.BAD_REQUEST);
      case ErrorCode.TIMEOUT:
        throw new HttpException(denyRes.msg, HttpStatus.GATEWAY_TIMEOUT);
      case ErrorCode.SETTING_FAIL:
      default:
        throw new HttpException(denyRes.msg, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Internal()
  @Post('connection/:id')
  @HttpCode(HttpStatus.OK)
  async enableConnection(@Param() param) {
    let dto = new EnableConnectionDto();
    dto = Object.assign(dto, param);
    const removeConnectionAsyncRes =
      await this.loginService.enableConnectionAsync(dto);
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

  @Internal()
  @Delete('connection/:username')
  @HttpCode(HttpStatus.OK)
  async removeConnection(@Param() param) {
    let dto = new RemoveConnectionDto();
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
