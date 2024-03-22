import { SetMetadata, applyDecorators } from '@nestjs/common';
import { OperatorCodeEnum } from 'src/operation-record/enum/operation-record.enum';

export namespace Metadata {
  export const Public = 'Public';
  export const IgnoreCaptcha = 'IgnoreCaptcha';
  export const Internal = 'isInternal';
  export const RecordOperation = 'isRecordOperation';
}

export function Public(isIgnoreCaptcha: boolean = false) {
  return applyDecorators(
    SetMetadata(Metadata.Public, true),
    SetMetadata(Metadata.IgnoreCaptcha, isIgnoreCaptcha),
  );
}

export function Internal() {
  return applyDecorators(
    SetMetadata(Metadata.Internal, true),
    SetMetadata(Metadata.IgnoreCaptcha, true),
  );
}

export function RecordOperation(code: OperatorCodeEnum) {
  return applyDecorators(SetMetadata(Metadata.RecordOperation, code));
}
