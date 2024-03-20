import { LoggerService } from '@nestjs/common';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import {
  IRequestLoggerServiceType,
  ILoggerServiceType,
} from '../infra/log/interface/logger.interface';

export class RequestLoggerTemplate {
  private _contextId;

  protected get logger() {
    return Promise.apply(this.getLogger);
  }

  constructor(protected readonly _moduleRef: ModuleRef) {
    this._contextId = ContextIdFactory.create();
  }

  async getLogger(): Promise<LoggerService> {
    let logger: LoggerService;
    try {
      logger = await this._moduleRef.resolve<LoggerService>(
        IRequestLoggerServiceType,
        this._contextId,
        { strict: false },
      );
    } catch (e) {
      logger = await this._moduleRef.get<LoggerService>(ILoggerServiceType, {
        strict: false,
      });
      logger.error(e);
    }
    return logger;
  }
}
