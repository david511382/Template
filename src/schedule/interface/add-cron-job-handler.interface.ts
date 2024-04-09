import { Response } from '../../common/entities/response.entity';
import { AddCronJobParamsServiceDto } from '../dto/add-cron-job-params-service.dto';

export interface IAddCronJobHandler {
  execAsync(params: AddCronJobParamsServiceDto): Promise<Response<void>>;
}

export const IAddCronJobHandlerType = Symbol('IAddCronJobHandler');
