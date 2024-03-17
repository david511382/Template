import {
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { IResponse } from '../../../common/interface/response.interface';
import { newResponse } from '../../../common/response';
import { ErrorCode } from '../../../common/error/error-code.enum';
import { Subject } from 'rxjs';

@Injectable()
export class ResponseParserMiddleware implements NestMiddleware {
  static createResSubject(request: Request): Subject<IResponse<any>> {
    request['resSubject'] = request['resSubject'] || new Subject<IResponse<any>>();
    return request['resSubject'];
  }

  constructor() { }

  use(request: Request, response: Response, next: NextFunction): void {
    const resSubject = ResponseParserMiddleware.createResSubject(request);

    const rawResponse = response.write;
    const rawResponseEnd = response.end;
    const chunkBuffers = [];
    response.write = (...chunks) => {
      const resArgs = [];
      for (let i = 0; i < chunks.length; i++) {
        resArgs[i] = chunks[i];
        if (!resArgs[i]) {
          response.once('drain', response.write);
          i--;
        }
      }
      if (resArgs[0]) {
        chunkBuffers.push(Buffer.from(resArgs[0]));
      }
      return rawResponse.apply(response, resArgs);
    };
    response.end = (...chunk) => {
      const resArgs = [];

      const hasResponseData = chunk.length > 0;
      if (hasResponseData) {
        let res: IResponse<any>;
        const isCached = response.statusCode === HttpStatus.NOT_MODIFIED;
        if (isCached) {
          res = newResponse<void>().setMsg(ErrorCode.CACHED);
        } else {
          for (let i = 0; i < chunk.length; i++) {
            resArgs[i] = chunk[i];
          }
          chunkBuffers.push(Buffer.from(resArgs[0]));
          const rawBody = Buffer.concat(chunkBuffers).toString('utf8');
          let body, msg;
          try {
            body = JSON.parse(rawBody);
            try {
              const res = body as IResponse<any>;
              msg = res.msg;
            } catch { }
          } catch {
            body = rawBody || {};
          }
          res = newResponse(body).setMsg(msg);
        }

        resSubject.next(res);
      }

      return rawResponseEnd.apply(response, resArgs);
    };

    next();
  }

}
