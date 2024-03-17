import { Response } from '../../common/response';
import { LoginRequirement } from '../entities/login-requirement.enetity';

export interface ISetEventService {
  disableAsync(
    loginRequirement: LoginRequirement,
    endTime: Date,
  ): Promise<Response<void>>;
}

export const ISetEventServiceType = Symbol('ISetEventService');
