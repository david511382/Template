import { Inject, Injectable, LoggerService, Scope } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { AddCronJobServiceDto } from './dto/add-cron-job-service.dto';
import {
  IAddCronJobHandler,
  IAddCronJobHandlerType,
} from './interface/add-cron-job-handler.interface';
import { Response, newResponse } from '../common/entities/response.entity';
import { ErrorCode } from '../common/error/error-code.enum';
import { ILoggerServiceType } from '../infra/log/interface/logger.interface';
import { DeleteCronJobServiceDto } from './dto/delete-cron-job-service.dto';
import { SchedulerErrEnum } from './enum/schedulerErr.enum';
import {
  IFindService,
  IFindServiceType,
} from './interface/find-service.interface';

@Injectable()
export class ScheduleService {
  constructor(
    @Inject(ILoggerServiceType) private readonly _logger: LoggerService,
    private readonly _schedulerRegistry: SchedulerRegistry,
    @Inject(IAddCronJobHandlerType)
    private readonly _addCronJobHandler: IAddCronJobHandler,
    @Inject(IFindServiceType)
    private readonly _f: IFindService,
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
    try {
      this._schedulerRegistry.addCronJob(dto.name, job);
      job.start();
    } catch (e) {
      const err = e as Error;
      if (err.message.includes(SchedulerErrEnum.PastDate)) {
        this._schedulerRegistry.deleteCronJob(dto.name);
        return res.setMsg(ErrorCode.PAST_DATE);
      } else {
        this._logger.error(e);
        return res.setMsg(ErrorCode.SYSTEM_FAIL);
      }
    }

    this._logger.log(`job ${dto.name} added`);

    return res;
  }

  deleteCronJob(dto: DeleteCronJobServiceDto): Response<void> {
    const res = newResponse<void>();

    try {
      this._schedulerRegistry.deleteCronJob(dto.name);
    } catch (e) {
      const err = e as Error;
      if (err.message.includes(SchedulerErrEnum.NotFound)) {
        return res.setMsg(ErrorCode.NOT_FOUND);
      } else {
        this._logger.error(e);
        return res.setMsg(ErrorCode.SYSTEM_FAIL);
      }
    }

    this._logger.log(`job ${dto.name} deleted!`);

    return res;
  }
}
