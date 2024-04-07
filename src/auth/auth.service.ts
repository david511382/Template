import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { LoginServiceDto } from './dto/auth-service.dto';
import { Response, newResponse } from '../common/response';
import { ErrorCode } from '../common/error/error-code.enum';
import { IdeServiceLoginDto } from './dto/ide-service-login.dto';
import { UserTokenDto } from './dto/user-token.dto';
import { ISignService, ISignServiceType } from './interface/sign.interface';
import { IConfigType, IConfig } from '../config/interface/config.interface';
import { ILoggerServiceType } from '../infra/log/interface/logger.interface';
import { SignService } from './sign/sign.service';
import { JwtService } from '@nestjs/jwt';
import {
  IInternalSignService,
  IInternalSignServiceType,
} from '../common/interface/internal-sign.interface';

@Injectable()
export class AuthService implements ISignService, IInternalSignService {
  constructor(
    @Inject(ISignServiceType) private readonly _signService: ISignService,
    @Inject(IInternalSignServiceType)
    private readonly _internalSignService: IInternalSignService,
  ) {}

  async login(dto: LoginServiceDto): Promise<Response<string>> {
    const res = newResponse<string>();

    // ide login

    // pick token data
    const tokenData: UserTokenDto = {
      id: 1,
      email: dto.username,
    };

    // sign
    {
      const signTokenAsyncRes =
        await this._signService.signTokenAsync(tokenData);
      switch (signTokenAsyncRes.msg) {
        case ErrorCode.SUCCESS:
          res.results = signTokenAsyncRes.results;
          break;
        default:
          return res.setMsg(ErrorCode.SYSTEM_FAIL);
      }
    }

    return res;
  }

  signTokenAsync(data: UserTokenDto): Promise<Response<string>> {
    return this._signService.signTokenAsync(data);
  }
  verifyTokenAsync(token: string): Promise<Response<UserTokenDto>> {
    return this._signService.verifyTokenAsync(token);
  }
  signInternalTokenAsync(): Promise<Response<string>> {
    return this._internalSignService.signInternalTokenAsync();
  }
  verifyInternalTokenAsync(token: string): Promise<Response<void>> {
    return this._internalSignService.verifyInternalTokenAsync(token);
  }
}
