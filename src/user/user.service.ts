import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { UpdateDto } from './dto/update.dto';
import { Response, newResponse } from '../common/response';
import { ErrorCode } from '../common/error/error-code.enum';
import { ILoggerServiceType } from '../infra/log/interface/logger.interface';
import { FindDto } from './dto/find.dto';
import {
  IUpdateStorageService,
  IUpdateStorageServiceType,
} from './interface/update-storage.interface';
import {
  ICreateStorageService,
  ICreateStorageServiceType,
} from './interface/create-storage.interface';
import {
  IFindStorageService,
  IFindStorageServiceType,
} from './interface/find-storage.interface';
import {
  IIsExistStorageService,
  IIsExistStorageServiceType,
} from './interface/is-exist-storage.interface';
import { UserDo } from './do/user.do';
import { IUserService } from './interface/user-service.interface';
import { IsExistDto } from './dto/is-exist.dto';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(ILoggerServiceType)
    private readonly _logger: LoggerService,
    @Inject(ICreateStorageServiceType)
    private readonly _createStorageService: ICreateStorageService,
    @Inject(IFindStorageServiceType)
    private readonly _findStorageService: IFindStorageService,
    @Inject(IUpdateStorageServiceType)
    private readonly _updateStorageService: IUpdateStorageService,
    @Inject(IIsExistStorageServiceType)
    private readonly _isExistStorageService: IIsExistStorageService,
  ) {}

  async createAsync(user: UserDo): Promise<Response<UserDo>> {
    return await this._createStorageService.createAsync(user);
  }

  async findAsync(dto: FindDto): Promise<Response<UserDo>> {
    return await this._findStorageService.findAsync(dto);
  }

  async updateAsync(dto: UpdateDto): Promise<Response<void>> {
    const res = newResponse<void>();

    // load current data
    let user: UserDo;
    {
      const findAsyncRes = await this.findAsync({ id: dto.id });
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

  isExsitAsync(dto: IsExistDto): Promise<Response<boolean>> {
    return this._isExistStorageService.isExsitAsync(dto);
  }
}
