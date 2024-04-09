import { Injectable, LoggerService } from '@nestjs/common';
import { HttpLogger } from './http-logger';
import { ModuleRef } from '@nestjs/core';
import { IRequestLoggerServiceType } from './interface/logger.interface';
import { IHttpLoggerFactory } from './interface/http-logger-factory.interface';

@Injectable()
export class HttpLoggerFactory implements IHttpLoggerFactory {
  constructor(private readonly _moduleRef: ModuleRef) {}

  async create(partial?: Partial<HttpLogger>): Promise<HttpLogger> {
    const logger = (await this._moduleRef.resolve(
      IRequestLoggerServiceType,
    )) as LoggerService;
    return new HttpLogger(logger, partial);
  }
}
