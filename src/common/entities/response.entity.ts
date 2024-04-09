import { ErrorCode } from '../error/error-code.enum';
import { ErrorMessage } from './error-message.entity';

export class Response<Result extends any> {
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

  setMsg(errorCode: ErrorCode, ...args: any[]): Response<Result> {
    this._errorMessage = ErrorMessage.new(errorCode, ...args);
    return this;
  }
}

export function newResponse<Result>(result?: Result): Response<Result> {
  return new Response(ErrorCode.SUCCESS, result);
}
