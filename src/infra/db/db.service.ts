import {
  Inject,
  Injectable,
  LoggerService,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ILoggerServiceType } from '../log/interface/logger.interface';

@Injectable()
export class DbService extends PrismaClient implements OnModuleInit {
  constructor(
    @Inject(ILoggerServiceType) private readonly _logger: LoggerService,
  ) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }
}
