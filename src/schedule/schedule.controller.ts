import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { AddCronJobDto } from './dto/add-cron-job.dto';
import { ErrorCode } from '../common/error/error-code.enum';
import { Internal } from '../infra/http/metadata';
import { DeleteCronJobServiceDto } from './dto/delete-cron-job-service.dto';
import { AddCronJobServiceDto } from './dto/add-cron-job-service.dto';
import { ValidationPipe } from '../common/validation.pipe';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly _scheduleService: ScheduleService) {}

  @Internal()
  @Post('cronjob/:name')
  @HttpCode(HttpStatus.ACCEPTED)
  async addCronJob(@Body(ValidationPipe) body: AddCronJobDto, @Param() param) {
    let dto = new AddCronJobServiceDto();
    dto = Object.assign(dto, body);
    dto = Object.assign(dto, param);
    const addCronJobRes = await this._scheduleService.addCronJob(dto);
    switch (addCronJobRes.errorCode) {
      case ErrorCode.SUCCESS:
        break;
      case ErrorCode.WRONG_INPUT:
        throw new HttpException(addCronJobRes.msg, HttpStatus.BAD_REQUEST);
      default:
        throw new HttpException(
          addCronJobRes.msg,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  @Internal()
  @Post('cronjob/:name')
  @HttpCode(HttpStatus.OK)
  async deleteCronJob(@Param() param) {
    let dto = new DeleteCronJobServiceDto();
    dto = Object.assign(dto, param);
    const deleteCronJobRes = await this._scheduleService.deleteCronJob(dto);
    switch (deleteCronJobRes.errorCode) {
      case ErrorCode.SUCCESS:
        break;
      default:
        throw new HttpException(
          deleteCronJobRes.msg,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }
}
