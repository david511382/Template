import { Inject, Injectable, LoggerService } from '@nestjs/common';
import {
  IUserFactoryType,
  IUserFactory,
} from './interface/user-factory.interface';
import { User } from './entities/utm.entity';
import { UpdateServiceDto } from './dto/update-servive.dto';
import { IUserService } from './interface/user-service.interface';
import { Response, newResponse } from '../common/response';
import { ErrorCode } from '../common/error/error-code.enum';
import { IRequestLoggerServiceType } from '../infra/log/interface/logger.interface';
import { FindServiceDto } from './dto/find-service.dto';
import { IUpdateStorageService, IUpdateStorageServiceType } from './interface/update-storage.interface';
import { ICreateStorageService, ICreateStorageServiceType } from './interface/create-storage.interface';
import { IFindStorageService, IFindStorageServiceType } from './interface/find-storage.interface';
import { IIsExistStorageService, IIsExistStorageServiceType } from './interface/is-exist-storage.interface';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(IRequestLoggerServiceType)
    private readonly _logger: LoggerService,
    @Inject(IUserFactoryType)
    private readonly _userCreator: IUserFactory,
    @Inject(ICreateStorageServiceType)
    private readonly _createStorageService: ICreateStorageService,
    @Inject(IFindStorageServiceType)
    private readonly _findStorageService: IFindStorageService,
    @Inject(IUpdateStorageServiceType)
    private readonly _updateStorageService: IUpdateStorageService,
    @Inject(IIsExistStorageServiceType)
    private readonly _isExistStorageService: IIsExistStorageService,
  ) {}

  newUser(id?: number, user?: User): User {
    return this._userCreator.newUser(id, user);
  }

  async createAsync(user: User): Promise<Response<User>> {
    return await this._createStorageService.createAsync(user);
  }
  
  async findAsync(dto: FindServiceDto): Promise<Response<User>> {
    return await this._findStorageService.findAsync(dto);
  }

  async updateAsync(dto: UpdateServiceDto): Promise<Response<void>> {
    const res = newResponse<void>();

    // load current data
    let user: User;
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
      const updateAsyncRes =
        await this._updateStorageService.updateAsync(user);
      switch (updateAsyncRes.msg) {
        case ErrorCode.SUCCESS:
          break;
        default:
          return res.setMsg(ErrorCode.SYSTEM_FAIL);
      }
    }
    
    return res;
  }

  isExsitAsync(user: User): Promise<Response<boolean>> {
    return this._isExistStorageService.isExsitAsync(user);
  }
}
