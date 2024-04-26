import { HttpException } from '@nestjs/common';
import { ErrorCode } from '../../common/error/error-code.enum';

export class Exception extends HttpException {}

export function codeErrCode(
  codeOrException: number | HttpException,
): ErrorCode {
  const code: number =
    typeof codeOrException === 'number'
      ? codeOrException
      : codeOrException.getStatus();
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
