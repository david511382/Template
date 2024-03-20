import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { LogModule } from '../infra/log/log.module';
import { IIdFactoryType } from '../common/interface/id-factory.interface';
import { IdFactory } from '../infra/id-factory/id-factory';
import { InternalTokenType } from '../app.const';
import { ErrorCode } from '../common/error/error-code.enum';
import { SignModule } from '../infra/sign/sign.module';
import {
  IInternalSignService,
  IInternalSignServiceType,
} from '../common/interface/internal-sign.interface';
import moment from 'moment';

export function toDate(date: Date): Date {
  console.log(date);
  console.log(new Date(moment(date).date()));
  return new Date(moment(date).date());
}
