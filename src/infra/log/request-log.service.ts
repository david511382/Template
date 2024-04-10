import { Inject, Injectable, Scope } from '@nestjs/common';
import { IConfig, IConfigType } from '../../config/interface/config.interface';
import { v4 as uuidv4 } from 'uuid';
import { LoggerService } from './logger.service';
import { IParserFactoryType, IParserFactory } from './interface/parser-factory.interface';

@Injectable({ scope: Scope.REQUEST })
export class RequestLogService extends LoggerService {
  constructor(@Inject(IConfigType) config: IConfig, @Inject(IParserFactoryType) parserFactory: IParserFactory) {
    super(config, parserFactory,);
  }

  protected setStaticMeta(meta: Record<string, string>) {
    const uuid = uuidv4();
    meta.requestId = uuid;
  }
}
