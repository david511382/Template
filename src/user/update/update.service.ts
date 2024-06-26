import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { UpdateDto } from './dto/update.dto';
import { Response, newResponse } from '../../common/response';
import { ErrorCode } from '../../common/error/error-code.enum';
import { ILoggerServiceType } from '../../infra/log/interface/logger.interface';
import {
  IUpdateStorageService,
  IUpdateStorageServiceType,
} from './interface/update-storage.interface';
import { UserDo } from '../do/user.do';
import { IFindService, IFindServiceType } from '../interface/find-service.interface';
import { IUpdateService } from '../interface/update-service.interface';

@Injectable()
export class UpdateService implements IUpdateService {
  constructor(
    @Inject(ILoggerServiceType)
    private readonly _logger: LoggerService,
    @Inject(IFindServiceType)
    private readonly _findService: IFindService,
    @Inject(IUpdateStorageServiceType)
    private readonly _updateStorageService: IUpdateStorageService,
  ) { }

  async runAsync(dto: UpdateDto): Promise<Response<void>> {
    const res = newResponse<void>();

    // load current data
    let user: UserDo;
    {
      const findAsyncRes = await this._findService.runAsync({ id: dto.id });
      switch (findAsyncRes.msg) {
        case ErrorCode.SUCCESS:
          user = findAsyncRes.results;
          if (!user) {
            return res.setMsg(ErrorCode.ERR_MSG_ACCOUNT_NOT_EXIST);
          }
          break;
        default:
          return res.setMsg(ErrorCode.SYSTEM_FAIL);
      }
    }

    // modify
    {
      const setRes = await user.setAsync(dto);
      switch (setRes.msg) {
        case ErrorCode.SUCCESS:
          break;
        case ErrorCode.WRONG_PASSWORD_LENGTH:
          this._logger.log(setRes.msg);
          return res.setMsg(ErrorCode.WRONG_INPUT);
        default:
          return res.setMsg(ErrorCode.SYSTEM_FAIL);
      }
    }

    // save
    {
      const updateAsyncRes = await this._updateStorageService.updateAsync(user);
      switch (updateAsyncRes.msg) {
        case ErrorCode.SUCCESS:
          break;
        default:
          return res.setMsg(ErrorCode.SYSTEM_FAIL);
      }
    }

    return res;
  }
}
