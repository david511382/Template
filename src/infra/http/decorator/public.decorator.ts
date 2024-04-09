import { SetMetadata, applyDecorators } from '@nestjs/common';
import { OperatorCodeEnum } from 'src/operation-record/enum/operation-record.enum';

export const IS_PUBLIC_KEY = 'isPublic';
export const IS_IGNORE_CAPTCHA_KEY = 'isIgnoreCaptcha';
export function Public(isIgnoreCaptcha: boolean = false) {
  return applyDecorators(
    SetMetadata(IS_PUBLIC_KEY, true),
    SetMetadata(IS_IGNORE_CAPTCHA_KEY, isIgnoreCaptcha),
  );
}
export const IS_INTERNAL_KEY = 'isInternal';
export function Internal() {
  return applyDecorators(
    SetMetadata(IS_INTERNAL_KEY, true),
    SetMetadata(IS_IGNORE_CAPTCHA_KEY, true),
  );
}

export const IS_RECORD_OPERATION = 'isRecordOperation';
export function RecordOperation(code: OperatorCodeEnum) {
  return applyDecorators(SetMetadata(IS_RECORD_OPERATION, code));
}
