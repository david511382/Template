import { Inject, Injectable, Scope } from '@nestjs/common';
import { IConfig, IConfigType } from '../../config/interface/config.interface';
import { LoggerService } from './logger.service';
import { ILogRepoType, ILogRepo } from './interface/parser-factory.interface';
import { LogLevelNameEnum } from './enum/log-level.enum';
import { RequestIdFactory } from './request-id-factory';

@Injectable({ scope: Scope.REQUEST })
export class RequestLogService extends LoggerService {
  constructor(
    @Inject(IConfigType) config: IConfig,
    @Inject(ILogRepoType) logRepo: ILogRepo,
    private readonly _requestIdFactory: RequestIdFactory,
  ) {
    super(config, logRepo);
  }

  logOn(level: LogLevelNameEnum, message: any, ...optionalParams) {
    const requestId = this._requestIdFactory.get();
    const meta = { requestId };
    optionalParams.push(meta);
    super.logOn(level, message, ...optionalParams);
  }
}
