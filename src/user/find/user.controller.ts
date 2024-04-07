import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UpdateVo } from '../update/dto/update.vo';
import { UpdateDto } from '../update/dto/update.dto';
import { ValidationPipe } from '../../common/validation.pipe';
import { ErrorCode } from '../../common/error/error-code.enum';
import { UserDecorator } from '../user.decorator';
import {
  IUpdateService,
  IUpdateServiceType,
} from '../interface/update-service.interface';
import { ICreateService } from '../interface/create-service.interface';
import { IFindService } from '../interface/find-service.interface';
import { IIsExistService } from '../interface/is-exist-service.interface';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    @Inject(IUpdateServiceType)
    private readonly _createService: ICreateService,
    @Inject(IUpdateServiceType)
    private readonly _findService: IFindService,
    @Inject(IUpdateServiceType)
    private readonly _updateService: IUpdateService,
    @Inject(IUpdateServiceType)
    private readonly _isExistService: IIsExistService,
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
