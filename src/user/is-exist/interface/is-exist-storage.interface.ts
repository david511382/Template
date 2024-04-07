import { Response } from '../../../common/response';
import { IsExistStorageDto } from '../dto/is-exist-storage.dto';

export interface IIsExistStorageService {
  isExsitAsync(user: IsExistStorageDto): Promise<Response<boolean>>;
}

export const IIsExistStorageServiceType = Symbol('IIsExistStorageService');
