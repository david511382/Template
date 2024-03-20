import {
  Inject,
  Injectable,
  LoggerService,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ILoggerServiceType } from '../log/interface/logger.interface';

@Injectable()
export class CommonDbService extends PrismaClient implements OnModuleInit {
  constructor(
    @Inject(ILoggerServiceType) protected readonly _logger: LoggerService,
    url:string,
  ) {
    super({
      datasourceUrl:url,
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
    });
  }

  async onModuleInit() {
    await this.$connect();

    const formatLogFn = (e) => {
      return {
        // @ts-ignore
        message: e.query,
        // @ts-ignore
        params: e.params,
        // @ts-ignore
        durationMs: `${e.duration}`,
      };
    };
    // @ts-ignore
    this.$on('query', (e) => {
      const log = formatLogFn(e);
      this._logger.debug(log);
    });
    // @ts-ignore
    this.$on('error', (e) => {
      const log = formatLogFn(e);
      this._logger.error(log);
    });
    // @ts-ignore
    this.$on('warn', (e) => {
      const log = formatLogFn(e);
      this._logger.warn(log);
    });
    // @ts-ignore
    this.$on('info', (e) => {
      const log = formatLogFn(e);
      this._logger.log(log);
    });
  }
}
