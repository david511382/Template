import { Inject, Injectable } from '@nestjs/common';
import { IConfigType, IConfig } from '../config/interface/config.interface';
import {
  LoginRequirementDo,
  LoginRequirementEntityRecord,
} from './do/login-requirement.do';
import { LoginRequirementEntity } from './entities/login-requirement.enetity';

@Injectable()
export class LoginRequirementFactory {
  constructor(
    @Inject(IConfigType)
    private readonly _config: IConfig,
  ) {}

  create(
    partial?: Readonly<LoginRequirementEntityRecord> | LoginRequirementEntity,
  ): LoginRequirementDo {
    return new LoginRequirementDo(
      this._config.loginRequirement.enableHours,
      partial,
    );
  }
}
