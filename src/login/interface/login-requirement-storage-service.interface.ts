import { Response } from '../../common/entities/response.entity';
import { LoginRequirementDo } from '../do/login-requirement.do';

export interface ILoginRequirementStorageService {
  /**
   *
   * @param username
   * @throws { ErrorCode.SYSTEM_FAIL }
   */
  getAsync(username?: string): Promise<Response<LoginRequirementDo[]>>;

  /**
   *
   * @param loginRequirement
   * @throws { ErrorCode.EXISTING }
   * @throws { ErrorCode.SYSTEM_FAIL }
   */
  saveAsync(loginRequirement: LoginRequirementDo): Promise<Response<void>>;

  removeAsync(username: string): Promise<Response<number>>;
}

export const ILoginRequirementStorageServiceType = Symbol(
  'ILoginRequirementStorageService',
);
