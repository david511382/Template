import { Inject, Injectable } from '@nestjs/common';
import { LoginRequirement } from '../entities/login-requirement.enetity';
import { newResponse, Response } from '../../common/response';
import { ErrorCode } from '../../common/error/error-code.enum';
import { ISetStorageService } from '../interface/set-storage-service.interface';
import {
  ILoginRequirementStorageService,
  ILoginRequirementStorageServiceType,
} from '../interface/login-requirement-storage-service.interface';

@Injectable()
export class SetStorageAdp implements ISetStorageService {
  constructor(
    @Inject(ILoginRequirementStorageServiceType)
    private readonly _loginRequirementStorageService: ILoginRequirementStorageService,
  ) {}

  async getAsync(username: string): Promise<Response<LoginRequirement>> {
    const res = newResponse<LoginRequirement>(undefined);

    let loginRequirements: LoginRequirement[];
    const getAsyncRes =
      await this._loginRequirementStorageService.getAsync(username);
    switch (getAsyncRes.errorCode) {
      case ErrorCode.SUCCESS:
        loginRequirements = getAsyncRes.results;
        break;
      default:
        return res.setMsg(ErrorCode.SYSTEM_FAIL);
    }

    if (loginRequirements.length > 0) res.results = loginRequirements[0];

    return res;
  }

  async removeAsync(
    loginRequirement: LoginRequirement,
  ): Promise<Response<void>> {
    const removeAsyncRes =
      await this._loginRequirementStorageService.removeAsync(
        loginRequirement.username,
      );
    return newResponse<void>().setMsg(removeAsyncRes.errorCode);
  }
}
