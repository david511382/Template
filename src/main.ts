import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IConfig, IConfigType } from './config/interface/config.interface';
import { ILoggerServiceType } from './infra/log/interface/logger.interface';
import { LoggerService } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as moment from 'moment-timezone';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // bufferLogs to true to make sure all logs will be buffered until a custom logger is attached
    bufferLogs: true,
  });
  const logger = app.get(ILoggerServiceType) as LoggerService;
  app.useLogger(logger);
  const config = app.get(IConfigType) as IConfig;
  app.use(cookieParser());

  moment.tz.setDefault(config.tz);

  logger.log(`on ${config.env}`);
  logger.log(`listen ${config.http.port}`);
  await app.listen(config.http.port);
}
bootstrap();
