import { Inject, Injectable } from '@nestjs/common';
import { Response, newResponse } from '../../common/response';
import { Prisma } from '@prisma/client';
import { ErrorCode } from '../../common/error/error-code.enum';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { IUserStorageService, IUserStorageServiceType } from '../../common/interface/user-storage.interface';
import { User } from '../entities/user.entity';
import { IUpdateStorageService } from '../interface/update-storage.interface';

@Injectable()
export class UpdateStorageDbAdp implements IUpdateStorageService {
  constructor(
    @Inject(IUserStorageServiceType)
    private readonly _userStorageService: IUserStorageService,
  ) {}

  async updateAccountAsync(user: User): Promise<Response<void>> {
    const res = newResponse<void>();
  
    const userData = instanceToPlain(user, {
      groups: ['store'],
    }) as Prisma.operation_recordUpdateInput;
  
    const updateAsyncRes =        await this._userStorageService.updateAsync(userData);
      switch (updateAsyncRes.msg) {
        case ErrorCode.SUCCESS:
          break;
        default:
          return res.setMsg(ErrorCode.SYSTEM_FAIL);
      }
  
    return res;
  }
}
