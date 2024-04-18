import { LoggerService } from '@nestjs/common';
import { MonoTypeOperatorFunction, tap } from 'rxjs';
import { AxiosResponse } from 'axios';
import { LogNameEnum } from './enum/log-name.enum';

class RequestLog {
  ip?: string;
  userAgent?: string;
  headers?: Record<string, string>;
  body?: any;
  cookies?: Record<string, string>;
}

class ResponseLog {
  msg?: string;
  headers?: Record<string, string>;
  body?: any;
  statusCode: number;
}

class AxiosResponseLog extends ResponseLog {
  constructor(response: AxiosResponse) {
    super();

    this.msg = response.statusText;
    this.body = response.data;
    this.statusCode = response.status;
    this.headers = {};
    Object.entries(response.headers).map((kv) => {
      const k = kv[0];
      const v = kv[1];
      this.headers[k] = v;
    });
  }
}

export class HttpLogger {
  method: string;
  path: string;
  endTime?: Date;
  fromTime?: Date;
  req: RequestLog;
  res: ResponseLog;

  constructor(
    private readonly _logger: LoggerService,
    partial?: Partial<HttpLogger>,
  ) {
    this.req = new RequestLog();
    this.res = new ResponseLog();
    if (partial) Object.assign(this, partial);
  }

  get message() {
    return this.res?.msg
      ? `[${this.method}]${this.path} [${this.res.msg}]`
      : `[${this.method}]${this.path}`;
  }

  get durationMs() {
    return this.endTime && this.fromTime
      ? this.endTime.getTime() - this.fromTime.getTime()
      : undefined;
  }

  get simple() {
    const res = {
      message: this.message,
      path: this.path,
      method: this.method,
      req: this.req,
      res: this.res,
      name: LogNameEnum.HttpLog,
      status: this.res.statusCode,
    };

    const durationMs = this.durationMs;
    if (durationMs) res['durationMs'] = durationMs;

    return res;
  }

  log(): MonoTypeOperatorFunction<AxiosResponse<any, any>> {
    this.start();
    return tap((response) => {
      this.endResponse(response);
    });
  }

  start(): HttpLogger {
    this.fromTime = new Date();
    return this;
  }

  end(): HttpLogger {
    this.endTime = new Date();
    return this;
  }

  endResponse(anyOrResponse: AxiosResponse | ResponseLog | any | undefined) {
    this.end();

    if (anyOrResponse) {
      if (anyOrResponse instanceof ResponseLog) {
        this.res = anyOrResponse;
      } else if (this.isAxiosResponse(anyOrResponse)) {
        this.res = new AxiosResponseLog(anyOrResponse);
      } else {
        this.res.body = anyOrResponse;
      }
    }

    this._logger.debug(this.simple);
  }

  private isAxiosResponse(r: AxiosResponse | any): r is AxiosResponse {
    return 'statusText' in r && 'data' in r && 'status' in r && 'headers' in r;
  }
}
