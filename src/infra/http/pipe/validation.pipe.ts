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

@Injectable()
export class GlobalValidationPipe extends ValidationPipe {
  constructor(
    @Inject(IRequestLoggerServiceType) private readonly _logger: LoggerService,
  ) {
    super({
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        this._logger.debug(`Validation failed: ${errors[0]}`);
        throw new HttpException(ErrorCode.WRONG_INPUT, HttpStatus.BAD_REQUEST);
      },
    });
  }
}
