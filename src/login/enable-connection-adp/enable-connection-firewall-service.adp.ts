import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { LoginRequirementDo } from '../do/login-requirement.do';
import { Response, newResponse } from '../../common/entities/response.entity';
import { IEnableConnectionFirewallService } from '../interface/enable-connection-firewall-service.interface';
import {
  IFirewallServiceType,
  IFirewallService,
} from '../interface/firewall-service.interface';
import { ErrorCode } from '../../common/error/error-code.enum';
import { LoginRequirementDbService } from '../../infra/db/login-requirement-db.service';
import { LoginRequirementFactory } from '../login-requirement-factory';
import { Prisma } from '../../../node_modules/.prisma/client/login_requirement';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { EntityExposeEnum } from '../../common/enum/expose.enum';
import { LoginRequirementEntity } from '../entities/login-requirement.enetity';
import { ILoggerServiceType } from '../../infra/log/interface/logger.interface';

@Injectable()
export class EnableConnectionFirewallServiceAdp
  implements IEnableConnectionFirewallService
{
  get loginRequirementStorageService() {
    return this._dbService.login_requirement;
  }

  constructor(
    @Inject(IFirewallServiceType)
    private readonly _firewallService: IFirewallService,
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

  async enable(loginRequirement: LoginRequirementDo): Promise<Response<void>> {
    const configAsyncRes = await this._firewallService.configAsync(
      loginRequirement.username,
      true,
    );
    if (configAsyncRes.errorCode != ErrorCode.SUCCESS) return configAsyncRes;

    const commitAsyncRes = await this._firewallService.commitAsync(
      loginRequirement.description,
    );
    if (commitAsyncRes.errorCode != ErrorCode.SUCCESS) return commitAsyncRes;

    return newResponse<void>();
  }

  async disable(username: string): Promise<Response<void>> {
    const configAsyncRes = await this._firewallService.configAsync(
      username,
      false,
    );
    if (configAsyncRes.errorCode != ErrorCode.SUCCESS) return configAsyncRes;

    const commitAsyncRes = await this._firewallService.commitAsync(username);
    if (commitAsyncRes.errorCode != ErrorCode.SUCCESS) return commitAsyncRes;

    return newResponse<void>();
  }
}
