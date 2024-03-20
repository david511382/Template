import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { Response, newResponse } from '../../common/response';
import { Prisma } from '@prisma/client';
import { ErrorCode } from '../../common/error/error-code.enum';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { IFindStorageService } from '../interface/find-storage.interface';
import { FindStorageDto } from '../dto/find-storage.dto';
import { User } from '../entities/utm.entity';
import { IRequestLoggerServiceType } from '../../infra/log/interface/logger.interface';
import { UserDbService } from '../../infra/db/user-db.service';

@Injectable()
export class FindStorageDbAdp implements IFindStorageService {
  get userStorageService(){
    return this._dbService.user;
      }
      
  constructor(
    @Inject(IRequestLoggerServiceType) private readonly _logger: LoggerService,
    @Inject(UserDbService) private readonly _dbService: UserDbService,
  ) {}

  async  findAsync(dto: FindStorageDto): Promise<Response<User>> {
    const res = newResponse<User>();

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
       res.results= plainToInstance(User, plainDbData);
      }
    } catch (e) {
      this._logger.error(e);
      res.setMsg(ErrorCode.SYSTEM_FAIL);
    } finally {
      return res;
    }
  }
}
