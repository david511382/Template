import { Response } from '../../common/response';
import { LoginRequirement } from '../entities/login-requirement.enetity';

export interface IGetStorageService {
  getAsync(): Promise<Response<LoginRequirement[]>>;
}

export const IGetStorageServiceType = Symbol('IGetStorageService');
