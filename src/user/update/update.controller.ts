import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ErrorCode } from '../../common/error/error-code.enum';
import {
  IUpdateServiceType,
  IUpdateService,
} from '../interface/update-service.interface';
import { UserDecorator } from '../user.decorator';
import { UpdateDto } from './dto/update.dto';
import { UpdateVo } from './dto/update.vo';

@ApiTags('user')
@Controller('user')
export class UpdateController {
  constructor(
    @Inject(IUpdateServiceType)
    private readonly _updateService: IUpdateService,
  ) {}

  @Put()
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'updateUser' })
  @ApiBadRequestResponse({ description: 'Wrong Input Or Not Exist' })
  @ApiUnauthorizedResponse({ description: 'Verify Fail' })
  @ApiInternalServerErrorResponse({ description: 'System Error' })
  async update(
    @UserDecorator('id') id: number,
    @Body(ValidationPipe) body: UpdateVo,
  ): Promise<void> {
    const dto = new UpdateDto({ id, ...body });

    const runAsyncRes = await this._updateService.runAsync(dto);
    switch (runAsyncRes.msg) {
      case ErrorCode.SUCCESS:
        break;
      case ErrorCode.WRONG_INPUT:
        throw new HttpException(ErrorCode.WRONG_INPUT, HttpStatus.BAD_REQUEST);
      case ErrorCode.ERR_MSG_ACCOUNT_NOT_EXIST:
        throw new HttpException(
          ErrorCode.ERR_MSG_ACCOUNT_NOT_EXIST,
          HttpStatus.BAD_REQUEST,
        );
      default:
        throw new HttpException(
          ErrorCode.SYSTEM_FAIL,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }
}
