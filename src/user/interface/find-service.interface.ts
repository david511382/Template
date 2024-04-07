import { Response } from '../../common/response';
import { UserDo } from '../do/user.do';
import { FindDto } from '../find/dto/find.dto';

export interface IFindService {
  runAsync(dto: FindDto): Promise<Response<UserDo>>;
}

export const IFindServiceType = Symbol('IFindService');
