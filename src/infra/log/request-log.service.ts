import { Inject, Injectable, Scope } from '@nestjs/common';
import { LoggerOptions } from 'winston';
import { IConfig, IConfigType } from '../../config/interface/config.interface';
import { LogService } from './log.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable({ scope: Scope.REQUEST })
export class RequestLogService extends LogService {
  constructor(@Inject(IConfigType) config: IConfig) {
    super(config);
  }

  protected getLoggerOptions(config: IConfig): LoggerOptions {
    const options = super.getLoggerOptions(config);
    const uuid = uuidv4();
    options.defaultMeta.requestId = uuid;
    return options;
  }
}
