import { Inject, Injectable, LoggerService, Scope } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { AddCronJobServiceDto } from './dto/add-cron-job-service.dto';
import {
  IAddCronJobHandler,
  IAddCronJobHandlerType,
} from './interface/add-cron-job-handler.interface';
import { Response, newResponse } from '../common/response';
import { ErrorCode } from '../common/error/error-code.enum';
import { ILoggerServiceType } from '../infra/log/interface/logger.interface';
import { DeleteCronJobServiceDto } from './dto/delete-cron-job-service.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @Inject(ILoggerServiceType) private readonly _logger: LoggerService,
    private readonly _schedulerRegistry: SchedulerRegistry,
    @Inject(IAddCronJobHandlerType)
    private readonly _addCronJobHandler: IAddCronJobHandler,
  ) {}

  addCronJob(dto: AddCronJobServiceDto): Response<void> {
    const res = newResponse<void>();

    const cronTime = !dto.time ? dto.cronTime : dto.time;
    if (!cronTime) return res.setMsg(ErrorCode.WRONG_INPUT);

    const job = new CronJob(cronTime, async () => {
      const execAsyncRes = await this._addCronJobHandler.execAsync(dto.params);
      switch (execAsyncRes.errorCode) {
        case ErrorCode.SUCCESS:
          break;
        default:
          this._logger.error(execAsyncRes.msg);
          return;
      }

      this._logger.log(`cron job ${dto.name} executed`);
    });
    this._schedulerRegistry.addCronJob(dto.name, job);
    job.start();

    this._logger.log(`job ${dto.name} added`);

    return res;
  }

  deleteCronJob(dto: DeleteCronJobServiceDto): Response<void> {
    const res = newResponse<void>();

    this._schedulerRegistry.deleteCronJob(dto.name);
    this._logger.log(`job ${dto.name} deleted!`);

    return res;
  }
}
