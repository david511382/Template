import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorCode } from './error/error-code.enum';
import { LoggerService } from '@nestjs/common';
import { ILoggerServiceType } from '../infra/log/interface/logger.interface';

@Catch(Error)
export class ErrorFilter implements ExceptionFilter {
  constructor(
    @Inject(ILoggerServiceType) private readonly _logger: LoggerService,
  ) {}

  catch(err: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    this._logger.error(err);

    response.status(status).json({ msg: ErrorCode.SYSTEM_FAIL });
  }
}
