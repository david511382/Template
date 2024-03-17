import { Response } from '../../common/response';
import { LoginRequirement } from '../entities/login-requirement.enetity';

export interface ILoginRequirementStorageService {
  /**
   *
   * @param username
   * @throws { ErrorCode.SYSTEM_FAIL }
   */
  getAsync(username?: string): Promise<Response<LoginRequirement[]>>;

  /**
   *
   * @param loginRequirement
   * @param timeoutSec
   * @throws { ErrorCode.EXISTING }
   * @throws { ErrorCode.SYSTEM_FAIL }
   */
  saveAsync(
    loginRequirement: LoginRequirement,
    timeoutSec: number,
  ): Promise<Response<void>>;

  removeAsync(username: string): Promise<Response<number>>;
}

export const ILoginRequirementStorageServiceType = Symbol(
  'ILoginRequirementStorageService',
);
