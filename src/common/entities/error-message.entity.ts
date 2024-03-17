import { sprintf } from 'sprintf-js';
import { ErrorCode } from '../error/error-code.enum';

export class ErrorMessage {
  static new(errorCode: ErrorCode, ...args: any[]): ErrorMessage {
    return new ErrorMessage(errorCode, ...args);
  }

  readonly ERROR_CODE: ErrorCode;
  readonly MSG: string;

  constructor(errorCode: ErrorCode, ...args: any[]) {
    this.ERROR_CODE = errorCode;
    this.MSG = sprintf(this.ERROR_CODE.toString(), ...args);
  }
}
