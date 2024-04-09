import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { FindResVo } from './dto/find-res.vo';
import { Response, newResponse } from '../../common/entities/response.entity';
import { FindDto } from './dto/find.dto';
import { ILoggerServiceType } from '../../infra/log/interface/logger.interface';
import { ErrorCode } from '../../common/error/error-code.enum';
import { SchedulerErrEnum } from '../enum/schedulerErr.enum';
import { CronJob } from 'cron';
import { IFindService } from '../interface/find-service.interface';

@Injectable()
export class FindService implements IFindService {
  constructor(
    @Inject(ILoggerServiceType) private readonly _logger: LoggerService,
    private readonly _schedulerRegistry: SchedulerRegistry,
  ) {}

  run(dto: FindDto): Response<FindResVo[]> {
    const res = newResponse<FindResVo[]>([]);

    const parseVoF = (cronJob: CronJob, name) => {
      const vo = new FindResVo({
        cronTime: cronJob.cronTime.toString(),
        running: cronJob.running,
        lastExecution: cronJob.lastExecution,
        runOnce: cronJob.runOnce,
      });
      vo.name = name;
      return vo;
    };
    if (dto.name) {
      try {
        const cronJob = this._schedulerRegistry.getCronJob(dto.name);
        if (cronJob) {
          const vo = parseVoF(cronJob, dto.name);
          res.results.push(vo);
        }
      } catch (e) {
        const err = e as Error;
        if (!err?.message?.includes(SchedulerErrEnum.NotFound)) {
          this._logger.error(e);
          return res.setMsg(ErrorCode.SYSTEM_FAIL);
        }
      }
    } else {
      const name_CronJobMap = this._schedulerRegistry.getCronJobs();
      name_CronJobMap.forEach((v, k) => {
        const vo = parseVoF(v, k);
        res.results.push(vo);
      });
    }

    return res;
  }
}
