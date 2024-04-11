import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorCode } from '../error/error-code.enum';
import { LoggerService } from '@nestjs/common';
import { ILoggerServiceType } from '../../infra/log/interface/logger.interface';

@Catch(Error)
export class ErrorFilter implements ExceptionFilter {
  constructor(
    @Inject(ILoggerServiceType) private readonly _logger: LoggerService,
  ) { }
  // private readonly httpAdapterHost: HttpAdapterHost,
  // catch(exception: unknown, host: ArgumentsHost): void {
  //   // In certain situations `httpAdapter` might not be available in the
  //   // constructor method, thus we should resolve it here.
  //   const { httpAdapter } = this.httpAdapterHost;

  //   const ctx = host.switchToHttp();

  //   const httpStatus =
  //     exception instanceof HttpException
  //       ? exception.getStatus()
  //       : HttpStatus.INTERNAL_SERVER_ERROR;

  //   const responseBody = {
  //     statusCode: httpStatus,
  //     timestamp: new Date().toISOString(),
  //     path: httpAdapter.getRequestUrl(ctx.getRequest()),
  //   };

  //   httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  // }
  catch(err: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    this._logger.error(err);

    response.status(status).json({ msg: ErrorCode.SYSTEM_FAIL });
  }
}
