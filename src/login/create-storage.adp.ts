import { Inject, Injectable } from '@nestjs/common';
import { LoginRequirement } from './entities/login-requirement.enetity';
import { Response, newResponse } from '../common/response';
import { Const } from './const/login.const';
import {
  ILoginRequirementStorageService,
  ILoginRequirementStorageServiceType,
} from './interface/login-requirement-storage-service.interface';
import { ICreateStorageService } from './interface/create-storage-service.interface';
import { ErrorCode } from '../common/error/error-code.enum';

@Injectable()
export class CreateStorageAdp implements ICreateStorageService {
  constructor(
    @Inject(ILoginRequirementStorageServiceType)
    private readonly _loginRequirementStorageService: ILoginRequirementStorageService,
  ) {}

  async createAsync(
    loginRequirement: LoginRequirement,
  ): Promise<Response<LoginRequirement>> {
    const res = newResponse<LoginRequirement>();

    const timeoutSec = Const.APPLY_LOGIN_TIMEOUT_HOUR * 3600;
    const saveAsyncRes = await this._loginRequirementStorageService.saveAsync(
      loginRequirement,
      timeoutSec,
    );
    if (saveAsyncRes.errorCode != ErrorCode.EXISTING) {
      return res.setMsg(saveAsyncRes.errorCode);
    }

    res.setMsg(ErrorCode.EXISTING);

    let existedLoginRequirement: LoginRequirement;
    {
      const getAsyncRes = await this._loginRequirementStorageService.getAsync(
        loginRequirement.username,
      );
      if (
        getAsyncRes.errorCode != ErrorCode.SUCCESS ||
        getAsyncRes.results.length === 0
      ) {
        return res;
      }

      existedLoginRequirement = getAsyncRes.results[0];
    }

    res.results = existedLoginRequirement;
    return res;
  }
}
