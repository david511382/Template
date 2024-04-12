import {
  Inject,
  Injectable,
  LogLevel,
  LoggerService as ILoggerService,
} from '@nestjs/common';
import { LogLevelNameEnum } from './enum/log-level.enum';
import { IConfig, IConfigType } from '../../config/interface/config.interface';
import { ILogRepo, ILogRepoType } from './interface/parser-factory.interface';
import { MSG_ALIAS } from './const/log.const';

@Injectable()
export class LoggerService implements ILoggerService {
  constructor(
    @Inject(IConfigType) private readonly _config: IConfig,
    @Inject(ILogRepoType) private readonly _logRepo: ILogRepo,
  ) {}

  logOn(level: LogLevelNameEnum, message: any, ...optionalParams) {
    const meta = {
      service: `${this._config.appName}`,
    };
    optionalParams.push(meta);

    let msg;
    if (typeof message === 'object') {
      msg =
        message instanceof Error
          ? `${message.name}: ${message.message}`
          : message[MSG_ALIAS];

      delete message.message;
      optionalParams.push(message);
    } else {
      msg = message;
    }

    this._logRepo.create({
      level,
      msg,
      optionalParams: Object.assign(
        {},
        ...optionalParams.filter((value) => typeof value != 'string'),
      ),
    });
  }

  log(message: any, ...optionalParams: any[]) {
    this.logOn(LogLevelNameEnum.Info, message, ...optionalParams);
  }
  error(message: any, ...optionalParams: any[]) {
    this.logOn(LogLevelNameEnum.Error, message, ...optionalParams);
  }
  warn(message: any, ...optionalParams: any[]) {
    this.logOn(LogLevelNameEnum.Warn, message, ...optionalParams);
  }
  debug?(message: any, ...optionalParams: any[]) {
    this.logOn(LogLevelNameEnum.Debug, message, ...optionalParams);
  }
  verbose?(message: any, ...optionalParams: any[]) {
    this.logOn(LogLevelNameEnum.Info, message, ...optionalParams);
  }
  fatal?(message: any, ...optionalParams: any[]) {
    this.logOn(LogLevelNameEnum.Fatal, message, ...optionalParams);
  }
  setLogLevels?(levels: LogLevel[]) {
    throw new Error('Method not implemented.');
  }
}
