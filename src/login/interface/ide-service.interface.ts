import { Response } from '../../common/response';
import { IdeServiceLoginDto } from '../dto/ide-service-login.dto';

export interface IIdeService {
  login(dto: IdeServiceLoginDto): Promise<Response<boolean>>;
}

export const IIdeServiceType = Symbol('IIdeService');
