import { Inject, Injectable, LoggerService } from '@nestjs/common';
import {
  IUserCreatorType,
  IUserCreator,
} from './interface/user-creator.interface';
import { User } from './entities/user.entity';
import { UpdateServiceDto } from './dto/update-servive.dto';
import { IUserService } from './interface/user-service.interface';
import { Response, newResponse } from '../common/response';
import { ErrorCode } from '../common/error/error-code.enum';
import { IUserStorageService, IUserStorageServiceType } from '../common/interface/user-storage.interface';
import { ISignupStorageService, ISignupStorageServiceType } from './interface/signup-storage.interface';
import { IRequestLoggerServiceType } from '../infra/log/interface/logger.interface';
import { FindServiceDto } from './entities/find-service.dto';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(IRequestLoggerServiceType)
    private readonly _logger: LoggerService,
    @Inject(IUserCreatorType)
    private readonly _userCreator: IUserCreator,
    @Inject(ISignupStorageServiceType)
    private readonly _signupStorageService: ISignupStorageService,
    @Inject(IUserStorageServiceType)
    private readonly _userStorageService: IUserStorageService,
  ) {}

  newUser(id?: number, user?: User): User {
    return this._userCreator.newUser(id, user);
  }

  async createAsync(user: User): Promise<Response<User>> {
    return await this._userStorageService.createAsync(user);
  }
  
  async findAsync(dto: FindServiceDto): Promise<Response<User>> {
    return await this._userStorageService.findAsync(dto);
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
        await this._userStorageService.updateAsync(user);
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
    return this._signupStorageService.isExsitAsync(user);
  }
}
