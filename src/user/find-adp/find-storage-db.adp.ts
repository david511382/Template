import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { Response, newResponse } from '../../common/response';
import { Prisma } from '../../../node_modules/.prisma/client/user';
import { ErrorCode } from '../../common/error/error-code.enum';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { IFindStorageService } from '../interface/find-storage.interface';
import { FindStorageDto } from '../dto/find-storage.dto';
import { ILoggerServiceType } from '../../infra/log/interface/logger.interface';
import { UserDbService } from '../../infra/db/user-db.service';
import { UserDo } from '../do/user.do';
import { UserEntity } from '../entities/user.entity';
import { EntityExposeEnum } from '../../common/enum/expose.enum';
import { IUserFactory, IUserFactoryType } from '../interface/user-factory.interface';

@Injectable()
export class FindStorageDbAdp implements IFindStorageService {
  get userStorageService() {
    return this._dbService.user;
  }

  constructor(
    @Inject(ILoggerServiceType) private readonly _logger: LoggerService,
    @Inject(UserDbService) private readonly _dbService: UserDbService,
    @Inject(IUserFactoryType) private readonly _userFactory: IUserFactory,
  ) {}

  async findAsync(dto: FindStorageDto): Promise<Response<UserDo>> {
    const res = newResponse<UserDo>();

    try {
      const select: Prisma.userSelect = {
        id: true,
        email: true,
        password: true,
      };
      const where: Prisma.userWhereUniqueInput = {
        id: dto.id,
        email: dto.email,
      };
      const foundUser = await this.userStorageService.findUnique({
        select,
        where,
      });

      if (foundUser) {
        const plain = instanceToPlain(foundUser);
        const entity = plainToInstance(UserEntity, plain, {
          groups: [EntityExposeEnum.Load],
        });
        res.results =this._userFactory.create( entity);
      }
    } catch (e) {
      this._logger.error(e);
      res.setMsg(ErrorCode.SYSTEM_FAIL);
    } finally {
      return res;
    }
  }
}
