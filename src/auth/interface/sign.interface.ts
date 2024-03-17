import { Response } from '../../common/response';
import { AccountTokenDto } from '../dto/account-token.dto';

export interface ISignService {
  signTokenAsync(data: AccountTokenDto): Promise<Response<string>>;
  verifyTokenAsync(token: string): Promise<Response<AccountTokenDto>>;
}

export const ISignServiceType = Symbol('ISignService');
