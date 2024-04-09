import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorCode } from '../error/error-code.enum';
import { LoggerService } from '@nestjs/common';

@Catch(Error)
export class ErrorFilter implements ExceptionFilter {
  constructor(private readonly _logger: LoggerService) {}

  catch(err: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    this._logger.error(err);

    response.status(status).json({ msg: ErrorCode.SYSTEM_FAIL });
  }
}
