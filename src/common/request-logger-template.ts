import { LoggerService } from '@nestjs/common';
import { ContextId, ContextIdFactory, ModuleRef, REQUEST } from '@nestjs/core';
import {
  IRequestLoggerServiceType,
  ILoggerServiceType,
} from '../infra/log/interface/logger.interface';

export class RequestLoggerTemplate {
  static async getLogger(
    moduleRef: ModuleRef,
    contextId?: ContextId,
  ): Promise<LoggerService> {
    if (!contextId)
      contextId = await RequestLoggerTemplate.fetchContextId(moduleRef);
    if (!contextId)
      return await RequestLoggerTemplate.getDefaultLogger(moduleRef);
    return await RequestLoggerTemplate.getRequestLogger(moduleRef, contextId);
  }

  static async getRequestLogger(
    moduleRef: ModuleRef,
    contextId: ContextId,
  ): Promise<LoggerService> {
    let logger: LoggerService;
    try {
      logger = await moduleRef.resolve<LoggerService>(
        IRequestLoggerServiceType,
        contextId,
        { strict: false },
      );
    } catch (e) {
      logger = await RequestLoggerTemplate.getDefaultLogger(moduleRef);
      logger.error(e);
    }
    return logger;
  }

  static async fetchContextId(moduleRef: ModuleRef): Promise<ContextId> {
    try {
      const request = await moduleRef.resolve<Request>(
        REQUEST,
        ContextIdFactory.create(),
        { strict: false },
      );
      return ContextIdFactory.getByRequest(request);
    } catch (e) {
      const logger = await moduleRef.get<LoggerService>(ILoggerServiceType, {
        strict: false,
      });
      logger.error(e);
      return undefined;
    }
  }

  static async getDefaultLogger(moduleRef: ModuleRef): Promise<LoggerService> {
    return await moduleRef.get<LoggerService>(ILoggerServiceType, {
      strict: false,
    });
  }

  private contextId: ContextId;

  protected async getLogger(): Promise<LoggerService> {
    return await RequestLoggerTemplate.getLogger(
      this._moduleRef,
      this.contextId,
    );
  }

  constructor(protected readonly _moduleRef: ModuleRef) {}
}
