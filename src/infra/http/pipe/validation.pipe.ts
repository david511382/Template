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
        throw new HttpException(msg, HttpStatus.BAD_REQUEST);
      },
    });
  }
}
