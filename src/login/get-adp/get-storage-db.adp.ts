import { Inject, Injectable } from '@nestjs/common';
import { LoginRequirementDo } from '../do/login-requirement.do';
import { Response, newResponse } from '../../common/entities/response.entity';
import { ErrorCode } from '../../common/error/error-code.enum';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Prisma } from '../../../node_modules/.prisma/client/login_requirement';
import { ModuleRef } from '@nestjs/core';
import { RequestLoggerTemplate } from '../../common/request-logger-template';
import { LoginRequirementDbService } from '../../infra/db/login-requirement-db.service';
import { LoginRequirementEntity } from '../entities/login-requirement.enetity';
import { IGetStorageService } from '../interface/get-storage-service.interface';
import { GetStorageGetDto } from '../dto/gets-storage-get.dto';
import { EntityExposeEnum } from '../../common/enum/expose.enum';
import { LoginRequirementFactory } from '../login-requirement-factory';

@Injectable()
export class GetStorageDbAdp
  extends RequestLoggerTemplate
  implements IGetStorageService
{
  get loginRequirementStorageService() {
    return this._dbService.login_requirement;
  }

  constructor(
    moduleRef: ModuleRef,
    @Inject(LoginRequirementDbService)
    private readonly _dbService: LoginRequirementDbService,
    private readonly _loginRequirementFactory: LoginRequirementFactory,
  ) {
    super(moduleRef);
  }

  async getAsync(
    dto: GetStorageGetDto,
  ): Promise<Response<LoginRequirementDo[]>> {
    const res = newResponse<LoginRequirementDo[]>([]);

    try {
      const select: Prisma.login_requirementSelect = {
        id: true,
        username: true,
        ip: true,
        description: true,
        request_time: true,
        request_date: true,
        connect_time: true,
      };
      const where: Prisma.login_requirementWhereInput = {
        request_date: dto.requestDate,
        apply_username: dto.applyUsername,
      };
      const founds = await this.loginRequirementStorageService.findMany({
        select,
        where,
      });

      const plain = instanceToPlain(<any[]>founds);
      const entities = plainToInstance(LoginRequirementEntity, <any[]>plain, {
        groups: [EntityExposeEnum.Load],
      });
      res.results = entities.map((entity) =>
        this._loginRequirementFactory.create(entity),
      );
    } catch (e) {
      (await super.getLogger()).error(e);
      return res.setMsg(ErrorCode.SYSTEM_FAIL);
    }

    return res;
  }
}
