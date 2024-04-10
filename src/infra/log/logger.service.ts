import { Inject, Injectable, LogLevel, LoggerService as ILoggerService } from '@nestjs/common';
import { LogLevelNameEnum } from './enum/log-level.enum';
import { IConfig, IConfigType } from '../../config/interface/config.interface';
import { IParserFactory, IParserFactoryType, ParserFn } from './interface/parser-factory.interface';

@Injectable()
export class LoggerService implements ILoggerService {
  private readonly _parser: ParserFn;

  constructor(@Inject(IConfigType) config: IConfig, @Inject(IParserFactoryType) parserFactory: IParserFactory) {
    const meta = {
      service: `${config.appName}`,
    };
    this.setStaticMeta(meta);
    this._parser = parserFactory.create(meta);
  }

  protected setStaticMeta(meta: Record<string, string>) {

  }

  logOn(level: LogLevelNameEnum, message: any, ...optionalParams) {
    let msg;
    if (typeof message === 'object') {
      msg =
        message instanceof Error
          ? `${message.name}: ${message.message}`
          : message['message'];

      delete message.message;
      optionalParams.push(message);
    } else {
      msg = message;
    }

    this._parser({ msgs: [{ level, msg, optionalParams }] })
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
