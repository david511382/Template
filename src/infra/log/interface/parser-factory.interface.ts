import { CreateDto } from '../dto/create.dto';

export interface ILogRepo {
  create(dto: CreateDto): void;
}

export const ILogRepoType = Symbol('ILogRepo');
