import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { Response, newResponse } from '../../common/response';
import { Prisma } from '.prisma/client/user';
import { ErrorCode } from '../../common/error/error-code.enum';
import { ILoggerServiceType } from '../../infra/log/interface/logger.interface';
import { UserDbService } from '../../infra/db/user-db.service';
import { IIsExistStorageService } from '../interface/is-exist-storage.interface';
import { IsExistStorageDto } from '../dto/is-exist-storage.dto';

@Injectable()
export class IsExistStorageDbAdp implements IIsExistStorageService {
  get userStorageService() {
    return this._dbService.user;
  }

  constructor(
    @Inject(ILoggerServiceType) private readonly _logger: LoggerService,
    @Inject(UserDbService) private readonly _dbService: UserDbService,
  ) {}

  async isExsitAsync(dto: IsExistStorageDto): Promise<Response<boolean>> {
    const res = newResponse<boolean>();

    try {
      const where: Prisma.userWhereUniqueInput = {
        id: dto.id,
        email: dto.email,
      };
      const found = await this.userStorageService.count({
        where,
      });
      res.results = found > 0;
    } catch (e) {
      this._logger.error(e);
      res.setMsg(ErrorCode.SYSTEM_FAIL);
    } finally {
      return res;
    }
  }
}
