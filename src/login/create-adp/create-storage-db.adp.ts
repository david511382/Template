import { Inject, Injectable } from '@nestjs/common';
import { LoginRequirementDo } from '../do/login-requirement.do';
import { Response, newResponse } from '../../common/entities/response.entity';
import { ICreateStorageService } from '../interface/create-storage-service.interface';
import { ErrorCode } from '../../common/error/error-code.enum';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Prisma } from '../../../node_modules/.prisma/client/login_requirement';
import { ModuleRef } from '@nestjs/core';
import { RequestLoggerTemplate } from '../../common/request-logger-template';
import { LoginRequirementDbService } from '../../infra/db/login-requirement-db.service';
import { CreateStorageFindDto } from '../dto/create-storage-find.dto';
import { LoginRequirementEntity } from '../entities/login-requirement.enetity';
import { EntityExposeEnum } from '../../common/enum/expose.enum';
import { LoginRequirementFactory } from '../login-requirement-factory';

@Injectable()
export class CreateStorageDbAdp
  extends RequestLoggerTemplate
  implements ICreateStorageService
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

  async createAsync(
    loginRequirement: LoginRequirementDo,
  ): Promise<Response<LoginRequirementDo>> {
    const res = newResponse<LoginRequirementDo>();

    try {
      const data = instanceToPlain(loginRequirement.entity, {
        groups: [EntityExposeEnum.Store],
      }) as Prisma.login_requirementCreateInput;

      const created = await this.loginRequirementStorageService.create({
        data,
      });
      const plain = instanceToPlain(created);
      const entity = plainToInstance(LoginRequirementEntity, plain, {
        groups: [EntityExposeEnum.Load],
      });
      res.results = this._loginRequirementFactory.create(entity);
    } catch (e) {
      (await super.getLogger()).error(e);
      return res.setMsg(ErrorCode.SYSTEM_FAIL);
    }

    return res;
  }

  async findAsync(
    dto: CreateStorageFindDto,
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
        username: dto.usernam,
        request_date: dto.date,
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
