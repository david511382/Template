import { Response } from '../../common/response';
import { UpdateDto } from '../update/dto/update.dto';

export interface IUpdateService {
  runAsync(dto: UpdateDto): Promise<Response<void>>;
}

export const IUpdateServiceType = Symbol('IUpdateService');
