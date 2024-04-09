import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { LoginRequirementDo } from '../do/login-requirement.do';
import { Response, newResponse } from '../../common/entities/response.entity';
import { ErrorCode } from '../../common/error/error-code.enum';
import { LoginRequirementDbService } from '../../infra/db/login-requirement-db.service';
import { LoginRequirementFactory } from '../login-requirement-factory';
import { Prisma } from '.prisma/client/login_requirement';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { EntityExposeEnum } from '../../common/enum/expose.enum';
import { LoginRequirementEntity } from '../entities/login-requirement.enetity';
import { ILoggerServiceType } from '../../infra/log/interface/logger.interface';

@Injectable()
export class CommonService {
  get loginRequirementStorageService() {
    return this._dbService.login_requirement;
  }

  constructor(
    @Inject(LoginRequirementDbService)
    private readonly _dbService: LoginRequirementDbService,
    private readonly _loginRequirementFactory: LoginRequirementFactory,
    @Inject(ILoggerServiceType)
    private readonly _logger: LoggerService,
  ) {}

  async getAsync(id: bigint): Promise<Response<LoginRequirementDo>> {
    const res = newResponse<LoginRequirementDo>();

    try {
      const select: Prisma.login_requirementSelect = {
        id: true,
        username: true,
        description: true,
      };
      const where: Prisma.login_requirementWhereUniqueInput = {
        id: id,
      };
      const found = await this.loginRequirementStorageService.findUnique({
        select,
        where,
      });

      const plain = instanceToPlain(found);
      const entity = plainToInstance(LoginRequirementEntity, plain, {
        groups: [EntityExposeEnum.Load],
      });
      res.results = this._loginRequirementFactory.create(entity);
    } catch (e) {
      this._logger.error(e);
      return res.setMsg(ErrorCode.SYSTEM_FAIL);
    }

    return res;
  }
}
