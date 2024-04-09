import { Inject, Injectable } from '@nestjs/common';
import { LoginRequirementDo } from '../do/login-requirement.do';
import { newResponse, Response } from '../../common/entities/response.entity';
import { ErrorCode } from '../../common/error/error-code.enum';
import { ISetStorageService } from '../interface/set-storage-service.interface';
import { RequestLoggerTemplate } from '../../common/request-logger-template';
import { ModuleRef } from '@nestjs/core';
import { Prisma } from '../../../node_modules/.prisma/client/login_requirement';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { LoginRequirementDbService } from '../../infra/db/login-requirement-db.service';
import { LoginRequirementEntity } from '../entities/login-requirement.enetity';
import { EntityExposeEnum } from '../../common/enum/expose.enum';
import { LoginRequirementFactory } from '../login-requirement-factory';

@Injectable()
export class SetStorageAdp
  extends RequestLoggerTemplate
  implements ISetStorageService
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
  async getAndSameDayApprovaledAsync(
    id: bigint,
  ): Promise<Response<LoginRequirementDo[]>> {
    const res = newResponse<LoginRequirementDo[]>([]);

    try {
      const select: Prisma.login_requirementSelect = {
        id: true,
        username: true,
        apply_username: true,
        apply_time: true,
        apply_date: true,
        connect_time: true,
        approval: true,
      };
      let loginRequirement: LoginRequirementDo;
      // get by id
      {
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
        loginRequirement = this._loginRequirementFactory.create(entity);
      }

      // get SameDayApprovaledAsync
      {
        const where: Prisma.login_requirementWhereInput = {
          request_date: loginRequirement.requestDate,
          approval: 1,
          username: loginRequirement.username,
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
      }

      res.results.push(loginRequirement);
    } catch (e) {
      (await super.getLogger()).error(e);
      return res.setMsg(ErrorCode.SYSTEM_FAIL);
    }

    return res;
  }

  async updaterAsync(
    loginRequirement: LoginRequirementDo,
  ): Promise<Response<void>> {
    const res = newResponse<void>();

    try {
      const data = instanceToPlain(loginRequirement.entity, {
        groups: [EntityExposeEnum.Store],
      }) as Prisma.login_requirementUpdateInput;
      const where: Prisma.login_requirementWhereUniqueInput = {
        id: loginRequirement.id,
      };
      await this.loginRequirementStorageService.update({
        data,
        where,
      });
    } catch (e) {
      (await super.getLogger()).error(e);
      return res.setMsg(ErrorCode.SYSTEM_FAIL);
    }

    return res;
  }
}
