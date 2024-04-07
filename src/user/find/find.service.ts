import { Injectable, Inject } from '@nestjs/common';
import { UserDo } from '../do/user.do';
import { FindDto } from './dto/find.dto';
import {
  IFindStorageServiceType,
  IFindStorageService,
} from './interface/find-storage.interface';
import { Response } from '../../common/response';

@Injectable()
export class FindService {
  constructor(
    @Inject(IFindStorageServiceType)
    private readonly _findStorageService: IFindStorageService,
  ) {}

  async runAsync(dto: FindDto): Promise<Response<UserDo>> {
    return await this._findStorageService.findAsync(dto);
  }
}
