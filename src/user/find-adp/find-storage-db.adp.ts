import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { Response, newResponse } from '../../common/response';
import { Prisma } from '@prisma/client';
import { ErrorCode } from '../../common/error/error-code.enum';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { IFindStorageService } from '../interface/find-storage.interface';
import { FindStorageDto } from '../dto/find-storage.dto';
import { IRequestLoggerServiceType } from '../../infra/log/interface/logger.interface';
import { UserDbService } from '../../infra/db/user-db.service';
import { UserDo } from '../do/user.do';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class FindStorageDbAdp implements IFindStorageService {
  get userStorageService() {
    return this._dbService.user;
  }

  constructor(
    @Inject(IRequestLoggerServiceType) private readonly _logger: LoggerService,
    @Inject(UserDbService) private readonly _dbService: UserDbService,
  ) { }

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
        const plainDbData = instanceToPlain(foundUser);
        res.results = plainToInstance(UserEntity, plainDbData);
      }
    } catch (e) {
      this._logger.error(e);
      res.setMsg(ErrorCode.SYSTEM_FAIL);
    } finally {
      return res;
    }
  }


  async getAsync(dto: GetStorageGetDto): Promise<Response<LoginRequirement[]>> {
    const res = newResponse<LoginRequirement[]>([]);

    try {
      const select: Prisma.login_requirementSelect = {
        id: true,
        username: true,
        ip: true,
        description: true,
        request_time: true,
        request_date: true,
      };
      const where: Prisma.login_requirementWhereInput = {
        request_date: dto.requestDate,
      };
      const founds = await this.loginRequirementStorageService.findMany({
        select,
        where,
      });

      const plain = instanceToPlain(<any[]>founds);
      const entities = plainToInstance(LoginRequirementEntity, <any[]>plain, {
        groups: [EntityExposeEnum.Load],
      });
      res.results = entities.map((entity) => new LoginRequirement(entity));
    } catch (e) {
      super.logger.error(e);
      return res.setMsg(ErrorCode.SYSTEM_FAIL);
    }

    return res;
  }
}
