import { Response } from '../../../common/response';
import { UserDo } from '../../do/user.do';
import { FindStorageDto } from '../dto/find-storage.dto';

export interface IFindStorageService {
  findAsync(dto: FindStorageDto): Promise<Response<UserDo>>;
}

export const IFindStorageServiceType = Symbol('IFindStorageService');
