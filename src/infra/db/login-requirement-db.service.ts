import {
  Inject,
  Injectable,
  LoggerService,
  OnModuleInit,
} from '@nestjs/common';
import { ILoggerServiceType } from '../log/interface/logger.interface';
import { IConfig, IConfigType } from '../../config/interface/config.interface';
import { PrismaClient } from '../../../node_modules/.prisma/client/login_requirement';
import { prismaClientConfig, initPrismaClient } from './common-db';

@Injectable()
export class LoginRequirementDbService
  extends PrismaClient
  implements OnModuleInit
{
  constructor(
    @Inject(ILoggerServiceType) private readonly _logger: LoggerService,
    @Inject(IConfigType) config: IConfig,
  ) {
    const {
      db: { loginRequirement },
    } = config;
    // @ts-ignore
    super(prismaClientConfig(loginRequirement.url));
  }

  async onModuleInit() {
    await initPrismaClient(this, this._logger);
  }
}
