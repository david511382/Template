import { Inject, Injectable } from '@nestjs/common';
import {
  IIdeService,
  IIdeServiceType,
} from './interface/ide-service.interface';
import { LoginServiceDto } from './dto/auth-service.dto';
import { Response, newResponse } from '../common/response';
import { ErrorCode } from '../common/error/error-code.enum';
import { IdeServiceLoginDto } from './dto/ide-service-login.dto';
import { AccountTokenDto } from './dto/account-token.dto';
import { ISignService, ISignServiceType } from './interface/sign.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(IIdeServiceType) private readonly _ideService: IIdeService,
    @Inject(ISignServiceType) private readonly _signService: ISignService,
  ) {}

  async login(dto: LoginServiceDto): Promise<Response<string>> {
    const res = newResponse<string>();

    // ide login
    {
      const loginDto: IdeServiceLoginDto = {
        username: dto.username,
        psw: dto.psw,
        ip: dto.ip,
      };
      const loginRes = await this._ideService.login(loginDto);
      switch (loginRes.errorCode) {
        case ErrorCode.SUCCESS:
          if (!loginRes.results) {
            return res.setMsg(ErrorCode.LOGIN_FAIL);
          }
          break;
        case ErrorCode.TIMEOUT:
          return res.setMsg(ErrorCode.TIMEOUT, 'IDE ');
        default:
          return res.setMsg(ErrorCode.SYSTEM_FAIL);
      }
    }

    // pick token data
    const tokenData: AccountTokenDto = {
      username: dto.username,
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
}
