import {
  Inject,
  Injectable,
  LoggerService,
  OnModuleInit,
} from '@nestjs/common';
import { ILoggerServiceType } from '../log/interface/logger.interface';
import { IConfig, IConfigType } from '../../config/interface/config.interface';
import { initPrismaClient, prismaClientConfig } from './common-db';
import { PrismaClient } from '../../../node_modules/.prisma/client/operation_record';

@Injectable()
export class OperationRecordDbService
  extends PrismaClient
  implements OnModuleInit
{
  constructor(
    @Inject(ILoggerServiceType) private readonly _logger: LoggerService,
    @Inject(IConfigType) config: IConfig,
  ) {
    const {
      db: { operationRecord },
    } = config;
    // @ts-ignore
    super(prismaClientConfig(operationRecord.url));
  }
  async onModuleInit() {
    await initPrismaClient(this, this._logger);
  }
}
