import { Response } from '../../common/response';
import { FindStorageDto } from '../dto/find-storage.dto';
import { User } from '../entities/utm.entity';

export interface IFindStorageService {
  findAsync(dto: FindStorageDto): Promise<Response<User>>;
}

export const IFindStorageServiceType = Symbol('IFindStorageService');
