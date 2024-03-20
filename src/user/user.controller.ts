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
  import { UpdateDto } from './dto/update.dto';
  import { UpdateServiceDto } from './dto/update-servive.dto';
  import { GlobalValidationPipe } from '../infra/http/pipe/validation.pipe';
import { ErrorCode } from '../common/error/error-code.enum';
import { User } from './entities/utm.entity';
import { IUserServiceType, IUserService } from './interface/user-service.interface';
import { UserDecorator } from './user.decorator';
  
  @ApiTags('user')
  @Controller('user')
  export class UserController {
    constructor(
      @Inject(IUserServiceType)
      private readonly _userService: IUserService,
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
      @Body(GlobalValidationPipe) body: UpdateDto,
    ): Promise<void> {
      const dto = new UpdateServiceDto({ id, ...body });
  
      const updateAsyncRes =
        await this._userService.updateAsync(dto);
      switch (updateAsyncRes.msg) {
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
  