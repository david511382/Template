import { Inject, Injectable, LoggerService, OnModuleInit } from '@nestjs/common';
import { ILoggerServiceType } from '../log/interface/logger.interface';
import { IConfig, IConfigType } from '../../config/interface/config.interface';
import { constructor, onModuleInit } from './common-db.service';
import { PrismaClient } from '../../../node_modules/.prisma/client/user';

@Injectable()
export class UserDbService
  extends PrismaClient
  implements OnModuleInit {
  constructor(
    @Inject(ILoggerServiceType) _logger: LoggerService,
    @Inject(IConfigType) config: IConfig,
  ) {
    const {
      db: { user },
    } = config;
    super(constructor(user.url));
  }
  async onModuleInit() {
    await onModuleInit();
  }
}
