import { Inject, Injectable } from '@nestjs/common';
import { ICreateStorageService } from '../interface/create-storage.interface';
import { Response, newResponse } from '../../common/response';
import { Prisma } from '@prisma/client';
import { ErrorCode } from '../../common/error/error-code.enum';
import { instanceToPlain } from 'class-transformer';
import { IUserStorageService, IUserStorageServiceType } from '../interface/user-storage.interface';
import { User } from '../entities/utm.entity';

@Injectable()
export class CreateStorageDbAdp implements ICreateStorageService {
  constructor(
    @Inject(IUserStorageServiceType)
    private readonly _userStorageService: IUserStorageService,
  ) {}

  async createAsync(user: User): Promise<Response<User>> {
    const res = newResponse<User>();

    const userData = instanceToPlain(user, {
      groups: ['store'],
    }) as Prisma.operation_recordCreateInput;

    const createAsyncRes =
      await this._userStorageService.createAsync(
        userData,
      );
    switch (createAsyncRes.errorCode) {
      case ErrorCode.SUCCESS:
        res.results = createAsyncRes.results;
        break;
      default:
        return res.setMsg(ErrorCode.SYSTEM_FAIL);
    }

    return res;
  }
}
