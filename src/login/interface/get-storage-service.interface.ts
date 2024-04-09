import { Response } from '../../common/entities/response.entity';
import { LoginRequirementDo } from '../do/login-requirement.do';
import { GetStorageGetDto } from '../dto/gets-storage-get.dto';

export interface IGetStorageService {
  getAsync(dto: GetStorageGetDto): Promise<Response<LoginRequirementDo[]>>;
}

export const IGetStorageServiceType = Symbol('IGetStorageService');
