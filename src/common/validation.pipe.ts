import {
  Injectable,
  LoggerService,
  Inject,
  HttpException,
  HttpStatus,
  ValidationPipe as NestValidationPipe,
  ValidationError,
} from '@nestjs/common';
import { ILoggerServiceType } from '../infra/log/interface/logger.interface';
import { ErrorCode } from './error/error-code.enum';

@Injectable()
export class ValidationPipe extends NestValidationPipe {
  constructor(
    @Inject(ILoggerServiceType) private readonly _logger: LoggerService,
  ) {
    super({
      transform: true,
      exceptionFactory: async (errors: ValidationError[]) => {
        this._logger.debug(`Validation failed: ${errors[0]}`);
        throw new HttpException(ErrorCode.WRONG_INPUT, HttpStatus.BAD_REQUEST);
      },
    });
  }
}
