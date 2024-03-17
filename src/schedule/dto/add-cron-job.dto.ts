import { OmitType } from '@nestjs/swagger';
import { AddCronJobServiceDto } from './add-cron-job-service.dto';

export class AddCronJobDto extends OmitType(AddCronJobServiceDto, [
  'name',
] as const) {}
