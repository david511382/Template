import { Response } from '../../common/response';
import { User } from '../entities/utm.entity';

export interface IIsExistStorageService {
  isExsitAsync(user: User): Promise<Response<boolean>>;
}

export const IIsExistStorageServiceType = Symbol('IIsExistStorageService');
