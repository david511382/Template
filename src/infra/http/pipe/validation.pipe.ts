import {
  Injectable,
  LoggerService,
  Inject,
  HttpException,
  HttpStatus,
  ValidationPipe,
  ValidationError,
} from '@nestjs/common';
import { IRequestLoggerServiceType } from '../../log/interface/logger.interface';
import { ErrorCode } from '../../../common/error/error-code.enum';
import { RequestLoggerTemplate } from '../../../common/request-logger-template';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class GlobalValidationPipe extends ValidationPipe {
  constructor(
    private readonly _moduleRef:ModuleRef,
  ) {
    super({
      transform: true,
      exceptionFactory:async (errors: ValidationError[]) => {
const logger = await       RequestLoggerTemplate.getLogger(this._moduleRef);
        logger.debug(`Validation failed: ${errors[0]}`);
        throw new HttpException(ErrorCode.WRONG_INPUT, HttpStatus.BAD_REQUEST);
      },
    });
  }
}
