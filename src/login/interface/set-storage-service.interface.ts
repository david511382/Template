import { Response } from '../../common/response';
import { LoginRequirement } from '../entities/login-requirement.enetity';

export interface ISetStorageService {
  getAsync(username: string): Promise<Response<LoginRequirement>>;
  removeAsync(loginRequirement: LoginRequirement): Promise<Response<void>>;
}

export const ISetStorageServiceType = Symbol('ISetStorageService');
