import * as bcrypt from 'bcrypt';
import { Inject, LoggerService } from '@nestjs/common';
import { IRequestLoggerServiceType } from '../log/interface/logger.interface';
import { IPswHash } from '../../user/interface/psw-hash.interface';
import { Response, newResponse } from '../../common/response';
import { ErrorCode } from '../../common/error/error-code.enum';

export class PswHash implements IPswHash {
  constructor(
    @Inject(IRequestLoggerServiceType) private readonly _logger: LoggerService,
  ) {}

  async hashAsync(psw: string): Promise<Response<string>> {
    const res = newResponse<string>();
    try {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(psw, salt);
      res.results = hash;
    } catch (e) {
      this._logger.error(e);
      res.setMsg( ErrorCode.SYSTEM_FAIL);
    } finally {
      return res;
    }
  }
  async checkAsync(psw: string, hash: string): Promise<Response<boolean>> {
    const res = newResponse<boolean>();
    try {
      res.results = await bcrypt.compare(psw, hash);
    } catch (e) {
      this._logger.error(e);
      res.setMsg( ErrorCode.SYSTEM_FAIL);
    } finally {
      return res;
    }
  }
}
