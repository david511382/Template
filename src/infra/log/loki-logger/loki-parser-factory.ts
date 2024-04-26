import { Injectable } from '@nestjs/common';
import { IConfig } from '../../../config/interface/config.interface';
import { ConsoleTransport } from '../console-transport';
import { WinstonParseFactory } from '../winston-parser-factory';
import { LokiTransport } from './loki-transport';
import { transport } from 'winston';

@Injectable()
export class LokiParseFactory extends WinstonParseFactory {
  constructor(config: IConfig) {
    super(config);
  }

  protected getTransports(): transport[] {
    return [new ConsoleTransport(this.config), new LokiTransport(this.config)];
  }
}
