import { Response } from '../../common/entities/response.entity';
import { LoginRequirementDo } from '../do/login-requirement.do';

export interface ISetEventService {
  enableAsync(loginRequirement: LoginRequirementDo): Promise<Response<void>>;

  disableAsync(
    loginRequirement: LoginRequirementDo,
    time: Date,
  ): Promise<Response<void>>;

  cancelIfExistAsync(
    loginRequirement: LoginRequirementDo,
    enable: boolean,
  ): Promise<Response<void>>;
}

export const ISetEventServiceType = Symbol('ISetEventService');
