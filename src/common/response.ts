import { ErrorCode } from './error/error-code.enum';
import { sprintf } from 'sprintf-js';
import { IResponse } from './interface/response.interface';
import { Exclude, Expose, Type } from 'class-transformer';

class ErrorMessage {
  static new(errorCode: ErrorCode, msg?: string, ...args: any[]): ErrorMessage {
    return new ErrorMessage(errorCode, msg, ...args);
  }

  readonly ERROR_CODE: ErrorCode;
  readonly MSG: string;

  constructor(errorCode: ErrorCode, msg?: string, ...args: any[]) {
    this.ERROR_CODE = errorCode;
    if (!msg) msg = this.ERROR_CODE.toString();
    this.MSG = sprintf(msg, ...args);
  }
}

@Exclude()
export class Response<Result extends any> implements IResponse<Result> {
  get errorCode(): ErrorCode {
    return this._errorMessage.ERROR_CODE;
  }

  get msg(): string {
    return this._errorMessage.MSG;
  }

  results: Result;

  private _errorMessage: ErrorMessage;

  constructor(errorCode: ErrorCode, results?: Result) {
    this._errorMessage = ErrorMessage.new(errorCode);
    this.results = results;
  }

  setMsg(errorCode: ErrorCode, msg?: string, ...args: any[]): Response<Result> {
    this._errorMessage = ErrorMessage.new(errorCode, msg, ...args);
    return this;
  }
}

export function newResponse<Result>(result?: Result): Response<Result> {
  return new Response(ErrorCode.SUCCESS, result);
}
