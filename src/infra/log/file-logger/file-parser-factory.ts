import { Injectable } from '@nestjs/common';
import { format, transport } from 'winston';
import { IConfig } from '../../../config/interface/config.interface';
import DailyRotateFile = require('winston-daily-rotate-file');
import { WinstonParseFactory } from '../winston-parser-factory';
import { ConsoleTransport } from '../console-transport';

@Injectable()
export class FileParseFactory extends WinstonParseFactory {
  constructor(config: IConfig) {
    super(config);
  }

  protected getTransports(): transport[] {
    return [
      new ConsoleTransport(this.config),
      new DailyRotateFile({
        format: format.combine(format.timestamp(), format.json()),
        filename: this.config.log.file.filename,
        dirname: this.config.log.file.dirname,
        datePattern: 'YYYY-MM-DD', // Rotate every day
        maxSize: '20m',
        maxFiles: this.config.log.file.maxfiles,
        level: this.config.log.file.level.toString(),
      }),
    ];
  }
}
