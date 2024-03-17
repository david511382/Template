import { Injectable, Inject } from '@nestjs/common';
import { Response } from '../common/response';
import { IdeServiceLoginDto } from './dto/ide-service-login.dto';
import { IIdeService } from './interface/ide-service.interface';
import {
  INativeIdeServiceType,
  INativeIdeService,
} from '../common/interface/native-ide-service.interface.';

@Injectable()
export class IdeAdpService implements IIdeService {
  constructor(
    @Inject(INativeIdeServiceType)
    private readonly _ideService: INativeIdeService,
  ) {}

  async login(dto: IdeServiceLoginDto): Promise<Response<boolean>> {
    return this._ideService.otpLogin(dto);
  }
}
