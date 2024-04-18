import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorCode } from '../error/error-code.enum';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  static codeErrCode(codeOrException: number | HttpException): ErrorCode {
    let code: number = (typeof codeOrException === 'number') ? codeOrException : codeOrException.getStatus();
    switch (code) {
      case 400:
        return ErrorCode.WRONG_INPUT;
      case 401:
        return ErrorCode.VAILD_FAIL;
      case 403:
        return ErrorCode.VAILD_FAIL;
      default:
        return ErrorCode.SYSTEM_FAIL;
    }
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const msg: string = HttpExceptionFilter.codeErrCode(status).toString();

    response.status(status).json({ msg });
  }
}
