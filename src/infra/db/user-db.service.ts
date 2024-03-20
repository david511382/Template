import {
  Inject,
  Injectable,
  LoggerService,
} from '@nestjs/common';
import { ILoggerServiceType } from '../log/interface/logger.interface';
import { IConfig, IConfigType } from '../../config/interface/config.interface';
import { CommonDbService } from './common-db.service';

@Injectable()
export class UserDbService extends CommonDbService{
  constructor(
    @Inject(ILoggerServiceType) logger: LoggerService,
    @Inject(IConfigType) config:IConfig,
  ) {
    const {db:{user}}= config;
    super(logger,user.url);
  }
}
