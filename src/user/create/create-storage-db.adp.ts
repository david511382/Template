import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ICreateStorageService } from './interface/create-storage.interface';
import { Response, newResponse } from '../../common/response';
import { Prisma } from '.prisma/client/user';
import { ErrorCode } from '../../common/error/error-code.enum';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { EntityExposeEnum } from '../../common/enum/expose.enum';
import { UserDo } from '../do/user.do';
import { UserDbService } from '../../infra/db/user-db.service';
import { ILoggerServiceType } from '../../infra/log/interface/logger.interface';
import { UserEntity } from '../entities/user.entity';
import { UserFactory } from '../user-factory';

@Injectable()
export class CreateStorageDbAdp implements ICreateStorageService {
  get userStorageService() {
    return this._dbService.user;
  }

  constructor(
    @Inject(ILoggerServiceType) private readonly _logger: LoggerService,
    @Inject(UserDbService) private readonly _dbService: UserDbService,
    private readonly _userFactory: UserFactory,
  ) {}

  async createAsync(user: UserDo): Promise<Response<UserDo>> {
    const res = newResponse<UserDo>();

    try {
      const userData = instanceToPlain(user.entity, {
        groups: [EntityExposeEnum.Store],
      }) as Prisma.userCreateInput;
      const utmData = instanceToPlain(user.utmEntity, {
        groups: [EntityExposeEnum.Store],
      }) as Prisma.utmCreateWithoutUsersInput;
      userData.utm = {
        connectOrCreate: {
          where: {
            campaign_source_medium: utmData,
          },
          create: utmData,
        },
      };
      const created = await this.userStorageService.create({ data: userData });
      const plain = instanceToPlain(created);
      const entity = plainToInstance(UserEntity, plain, {
        groups: [EntityExposeEnum.Load],
      });
      res.results = this._userFactory.create(entity);
    } catch (e) {
      this._logger.error(e);
      return res.setMsg(ErrorCode.SYSTEM_FAIL);
    }

    return res;
  }
}
