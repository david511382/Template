import {
  Injectable,
  Inject,
  LoggerService,
  NestMiddleware,
} from '@nestjs/common';
import { ILoggerServiceType } from '../../log/interface/logger.interface';
import { Request, Response, NextFunction } from 'express';
import { IResponse } from '../../../common/interface/response.interface';
import { ResponseParserMiddleware } from './response-parser.middleware';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(ILoggerServiceType) private readonly _logger: LoggerService,
  ) { }

  use(request: Request, response: Response, next: NextFunction): void {
    const fromTime = new Date();

    const resSubject = ResponseParserMiddleware.createResSubject(request);
    resSubject.subscribe((res) => {
      this.log(response, fromTime, res);
    });

    next();
  }

  private log(response: Response, fromTime: Date, res: IResponse<any>) {
    const endTime = new Date();
    const { statusCode, req: request } = response;
    const { ip, headers, body, method, cookies, path } = request;
    const userAgent = request.get('user-agent') || '';
    res.msg ||= statusCode.toString();
    const log = {
      message: `[${method}]${path} [${res.msg}]`,
      path,
      method,
      durationMs: endTime.getTime() - fromTime.getTime(),
      req: {
        ip,
        userAgent,
        headers,
        body,
        cookies,
      },
      res: {
        statusCode,
        body: res.results,
        // Returns a shallow copy of the current outgoing headers
        headers: response.getHeaders(),
      },
    };
    this._logger.log(log);
  }
}
