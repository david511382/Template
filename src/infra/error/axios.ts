import { AxiosError } from 'axios';
import { ErrorCode } from '../../common/error/error-code.enum';
import { codeErrCode } from './http';

type ErrHandler = (err: AxiosError) => ErrorCode | undefined;

export function handleCode(err: AxiosError, f: ErrHandler): ErrorCode {
  const errCode = f(err);
  if (errCode) return errCode;

  if (
    err.code === AxiosError.ETIMEDOUT ||
    err.code === AxiosError.ECONNABORTED
  ) {
    return ErrorCode.TIMEOUT;
  } else if (err.response) {
    const code = err.response.status;
    return codeErrCode(code);
  } else {
    return ErrorCode.SYSTEM_FAIL;
  }
}
