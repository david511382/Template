import { Response } from '../../common/response';
import { UserTokenDto } from '../dto/user-token.dto';

export interface ISignService {
  signTokenAsync(data: UserTokenDto): Promise<Response<string>>;
  verifyTokenAsync(token: string): Promise<Response<UserTokenDto>>;
}

export const ISignServiceType = Symbol('ISignService');
