import { Expose, Type } from 'class-transformer';
import { AddCronJobParamsServiceDto } from './add-cron-job-params-service.dto';
import { IsOptional } from 'class-validator';

export class AddCronJobServiceDto {
  @Expose({ name: 'name' })
  name: string;

  @IsOptional()
  @Expose({ name: 'cron_time' })
  cronTime?: string;

  @IsOptional()
  @Expose({ name: 'time' })
  @Type(() => Date)
  time?: Date;

  @Expose({ name: 'params' })
  @Type(() => AddCronJobParamsServiceDto)
  params: AddCronJobParamsServiceDto;
}
