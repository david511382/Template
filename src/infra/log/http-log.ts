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

export class HttpLog {
  method: string;
  path: string;
  endTime?: Date;
  fromTime?: Date;
  req: RequestLog;
  res: ResponseLog;

  constructor(partial?: Partial<HttpLog>) {
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
    };

    const durationMs = this.durationMs;
    if (durationMs) res['durationMs'] = durationMs;

    return res;
  }

  start(): HttpLog {
    this.fromTime = new Date();
    return this;
  }

  end(): HttpLog {
    this.endTime = new Date();
    return this;
  }
}
