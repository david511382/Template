import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { Response, newResponse } from '../../common/response';
import { ErrorCode } from '../../common/error/error-code.enum';
import { JwtService } from '@nestjs/jwt';
import { ILoggerServiceType } from '../../infra/log/interface/logger.interface';
import { UserTokenDto } from '../dto/user-token.dto';
import { IConfigType, IConfig } from '../../config/interface/config.interface';
import { ISignService } from '../interface/sign.interface';
import { InternalTokenDto } from '../dto/Internal-token.dto';
import { instanceToPlain } from 'class-transformer';
import { IInternalSignService } from '../../common/interface/internal-sign.interface';

@Injectable()
export class SignService implements ISignService, IInternalSignService {
  constructor(
    private readonly _jwtService: JwtService,
    @Inject(ILoggerServiceType) private readonly _logger: LoggerService,
    @Inject(IConfigType) private readonly _config: IConfig,
  ) {}

  async signTokenAsync(data: UserTokenDto): Promise<Response<string>> {
    const res = newResponse<string>();
    try {
      // parse to plain object
      const plainObj = Object.assign({}, data);
      res.results = await this._jwtService.signAsync(plainObj);
    } catch (e) {
      this._logger.error(e);
      return res.setMsg(ErrorCode.SYSTEM_FAIL);
    } finally {
      return res;
    }
  }

  async verifyTokenAsync(token: string): Promise<Response<UserTokenDto>> {
    const res = newResponse<UserTokenDto>();
    try {
      res.results = await this._jwtService.verifyAsync(token);
    } catch (e) {
      this._logger.error(e);
      res.setMsg(ErrorCode.VERIFY_FAIL);
    } finally {
      return res;
    }
  }

  async signInternalTokenAsync(): Promise<Response<string>> {
    const res = newResponse<string>();

    try {
      const data = new InternalTokenDto();
      data.key = this._config.auth.jwtKey;
      // parse to plain object
      const plainObj = instanceToPlain(data, { excludeExtraneousValues: true });
      res.results = await this._jwtService.signAsync(plainObj);
    } catch (e) {
      this._logger.error(e);
      return res.setMsg(ErrorCode.SYSTEM_FAIL);
    } finally {
      return res;
    }
  }

  async verifyInternalTokenAsync(token: string): Promise<Response<void>> {
    const res = newResponse<void>();

    let secretKey;
    try {
      const internalToken: InternalTokenDto =
        await this._jwtService.verifyAsync(token);
      secretKey = internalToken.key;
    } catch (e) {
      this._logger.error(e);
      return res.setMsg(ErrorCode.VERIFY_FAIL);
    }

    if (secretKey != this._config.auth.jwtKey)
      return res.setMsg(ErrorCode.VERIFY_FAIL);

    return res;
  }
}
