import { Injectable, Inject } from '@nestjs/common';
import { IsExistDto } from './dto/is-exist.dto';
import {
  IIsExistStorageServiceType,
  IIsExistStorageService,
} from './interface/is-exist-storage.interface';
import { Response } from '../../common/response';

@Injectable()
export class IsExistService {
  constructor(
    @Inject(IIsExistStorageServiceType)
    private readonly _isExistStorageService: IIsExistStorageService,
  ) {}

  async runAsync(dto: IsExistDto): Promise<Response<boolean>> {
    return await this._isExistStorageService.isExsitAsync(dto);
  }
}
