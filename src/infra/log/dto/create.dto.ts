import { LogLevelNameEnum } from '../enum/log-level.enum';

export class CreateDto {
  level: LogLevelNameEnum;
  msg: string;
  optionalParams: object;
}
