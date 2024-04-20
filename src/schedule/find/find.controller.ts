import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Query,
} from '@nestjs/common';
import { FindVo } from './dto/find.vo';
import { ErrorCode } from '../../common/error/error-code.enum';
import { GlobalValidationPipe } from '../../infra/http/pipe/validation.pipe';
import { FindDto } from './dto/find.dto';
import {
  IFindService,
  IFindServiceType,
} from '../interface/find-service.interface';
import { Internal } from '../../infra/http/decorator/public.decorator';
import { Exception } from '../../infra/error/http';

@Controller('schedule')
export class FindController {
  constructor(
    @Inject(IFindServiceType) private readonly _findService: IFindService,
  ) {}

  @Internal()
  @Get('cronjob')
  @HttpCode(HttpStatus.ACCEPTED)
  async addCronJob(@Query(GlobalValidationPipe) query: FindVo) {
    let dto = new FindDto();
    dto = Object.assign(dto, query);
    const runAsyncRes = this._findService.run(dto);
    switch (runAsyncRes.errorCode) {
      case ErrorCode.SUCCESS:
        return runAsyncRes.results;
      default:
        throw new Exception(runAsyncRes.msg, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
