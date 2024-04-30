import {
  Injectable,
  LoggerService,
  Inject,
  HttpStatus,
  ValidationPipe,
  ValidationError,
} from '@nestjs/common';
import { IRequestLoggerServiceType } from '../../log/interface/logger.interface';
import { Exception } from '../../error/http';

@Injectable()
export class GlobalValidationPipe extends ValidationPipe {
  constructor(
    @Inject(IRequestLoggerServiceType) private readonly _logger: LoggerService,
  ) {
    super({
      stopAtFirstError: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const err = errors[0];
        this._logger.debug(`Validation failed: ${err}`);
        const msg = err.constraints[Object.keys(err.constraints)[0]];
        throw new Exception(msg, HttpStatus.BAD_REQUEST);
      },
    });
  }
}
