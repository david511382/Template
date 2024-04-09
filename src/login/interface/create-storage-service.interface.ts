import { Response } from '../../common/entities/response.entity';
import { LoginRequirementDo } from '../do/login-requirement.do';
import { CreateStorageFindDto } from '../dto/create-storage-find.dto';

export interface ICreateStorageService {
  /**
   *
   * @param loginRequirement
   * @throws { ErrorCode.SYSTEM_FAIL }
   */
  createAsync(
    loginRequirement: LoginRequirementDo,
  ): Promise<Response<LoginRequirementDo>>;

  /**
   *
   * @param dto
   * @throws { ErrorCode.SYSTEM_FAIL }
   */
  findAsync(dto: CreateStorageFindDto): Promise<Response<LoginRequirementDo[]>>;
}

export const ICreateStorageServiceType = Symbol('ICreateStorageService');
