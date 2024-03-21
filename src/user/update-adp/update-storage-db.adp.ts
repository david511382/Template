import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { Response, newResponse } from '../../common/response';
import { Prisma } from '@prisma/client';
import { ErrorCode } from '../../common/error/error-code.enum';
import { instanceToPlain } from 'class-transformer';
import { IUpdateStorageService } from '../interface/update-storage.interface';
import { IRequestLoggerServiceType } from '../../infra/log/interface/logger.interface';
import { UserDbService } from '../../infra/db/user-db.service';
import { UserDo } from '../do/user.do';
import { EntityExposeEnum } from '../../common/enum/expose.enum';

@Injectable()
export class UpdateStorageDbAdp implements IUpdateStorageService {
  get userStorageService(){
return this._dbService.user;
  }

  constructor(
    @Inject(IRequestLoggerServiceType) private readonly _logger: LoggerService,
    @Inject(UserDbService) private readonly _dbService: UserDbService,
  ) {
  }

  async updateAsync(user: UserDo): Promise<Response<void>> {
    const res = newResponse<void>();
  
    try {
    const data = instanceToPlain(user.entity, {
      groups: [EntityExposeEnum.Store],
    }) as Prisma.userUpdateInput;
      const where: Prisma.userWhereUniqueInput = {
        id: user.id,
      };
      await this.userStorageService.update({
        data:{
          email:data.email
        },
        where,
      });
    } catch (e) {
      this._logger.error(e);
      return res.setMsg(ErrorCode.SYSTEM_FAIL);
    } 

    return res;
  }
}
