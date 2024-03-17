import { Response } from '../../common/response';
import { LoginRequirement } from '../entities/login-requirement.enetity';

export interface ICreateStorageService {
  /**
   *
   * @param loginRequirement
   * @throws { ErrorCode.EXISTING }
   * @throws { ErrorCode.SYSTEM_FAIL }
   */
  createAsync(
    loginRequirement: LoginRequirement,
  ): Promise<Response<LoginRequirement>>;
}

export const ICreateStorageServiceType = Symbol('ICreateStorageService');
