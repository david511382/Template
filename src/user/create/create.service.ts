import { Injectable, Inject } from '@nestjs/common';
import { UserDo } from '../do/user.do';
import {
  ICreateStorageServiceType,
  ICreateStorageService,
} from './interface/create-storage.interface';
import { Response } from '../../common/response';

@Injectable()
export class CreateService {
  constructor(
    @Inject(ICreateStorageServiceType)
    private readonly _createStorageService: ICreateStorageService,
  ) {}

  async runAsync(user: UserDo): Promise<Response<UserDo>> {
    return await this._createStorageService.createAsync(user);
  }
}
