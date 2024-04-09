import { Response } from '../../common/entities/response.entity';
import { LoginRequirementDo } from '../do/login-requirement.do';

export interface ISetStorageService {
  /**
   *
   * @param id
   * @throws { ErrorCode.SYSTEM_FAIL }
   */
  getAndSameDayApprovaledAsync(
    id: bigint,
  ): Promise<Response<LoginRequirementDo[]>>;

  updaterAsync(loginRequirement: LoginRequirementDo): Promise<Response<void>>;
}

export const ISetStorageServiceType = Symbol('ISetStorageService');
