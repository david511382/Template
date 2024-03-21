import { sprintf } from 'sprintf-js';
import { ErrorCode } from '../error/error-code.enum';

export class ErrorMessage {
  static new(errorCode: ErrorCode,msg?:string, ...args: any[]): ErrorMessage {
    return new ErrorMessage(errorCode,msg, ...args);
  }

  readonly ERROR_CODE: ErrorCode;
  readonly MSG: string;

  constructor(errorCode: ErrorCode,msg?:string, ...args: any[]) {
    this.ERROR_CODE = errorCode;
    if (!msg)msg = this.ERROR_CODE.toString();
    this.MSG = sprintf(msg, ...args);
  }
}
