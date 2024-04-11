import { Inject, Injectable } from '@nestjs/common';
import {
  IConfig,
  IConfigType,
} from '../../../config/interface/config.interface';
import { ConsoleTransport } from '../console-transport';
import { WinstonParseFactory } from '../winston-parser-factory';
import { LokiTransport } from './loki-transport';
import { transport } from 'winston';

@Injectable()
export class LokiParseFactory extends WinstonParseFactory {
  constructor(@Inject(IConfigType) config: IConfig) {
    super(config);
  }

  protected getTransports(): transport[] {
    return [new ConsoleTransport(this.config), new LokiTransport(this.config)];
  }
}
