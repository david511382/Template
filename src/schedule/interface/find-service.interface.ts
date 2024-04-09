import { Response } from '../../common/entities/response.entity';
import { FindResVo } from '../find/dto/find-res.vo';
import { FindDto } from '../find/dto/find.dto';

export interface IFindService {
  run(dto: FindDto): Response<FindResVo[]>;
}

export const IFindServiceType = Symbol('IFindService');
