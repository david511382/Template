import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorCode } from '../error/error-code.enum';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    let msg: string = exception.message;
    if (exception instanceof UnauthorizedException) {
      msg = ErrorCode.VAILD_FAIL;
    }

    response.status(status).json({ msg });
  }
}
