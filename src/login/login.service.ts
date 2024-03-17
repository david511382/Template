import { Inject, Injectable } from '@nestjs/common';
import { LoginRequirement } from './entities/login-requirement.enetity';
import { newResponse, Response } from '../common/response';
import { ErrorCode } from '../common/error/error-code.enum';
import { LoginServiceDto } from './dto/login-service.dto';
import {
  IIdeService,
  IIdeServiceType,
} from './interface/ide-service.interface';
import { IdeServiceLoginDto } from './dto/ide-service-login.dto';
import { LoginRequirementDto } from './dto/login-requirement.dto';
import { instanceToPlain } from 'class-transformer';
import { PassServiceDto } from './dto/pass-service.dto';
import {
  ISetStorageServiceType,
  ISetStorageService,
} from './interface/set-storage-service.interface';
import {
  ICreateStorageServiceType,
  ICreateStorageService,
} from './interface/create-storage-service.interface';
import {
  IGetStorageServiceType,
  IGetStorageService,
} from './interface/get-storage-service.interface';
import {
  ISetFirewallService,
  ISetFirewallServiceType,
} from './interface/set-firewall-service.interface';
import { DenyServiceDto } from './dto/deny-service.dto';
import { SetServiceDto } from './dto/set-service.dto';
import {
  ISetEventService,
  ISetEventServiceType,
} from './interface/set-event-service.interface';
import { RemoveConnectionServiceDto } from './dto/remove-connection-service.dto';
import {
  IRemoveConnectionFirewallService,
  IRemoveConnectionFirewallServiceType,
} from './interface/remove-connection-firewall-service.interface';
import { IConfig, IConfigType } from '../config/interface/config.interface';

@Injectable()
export class LoginService {
  constructor(
    @Inject(IIdeServiceType) private readonly _ideService: IIdeService,
    @Inject(IGetStorageServiceType)
    private readonly _getStorageService: IGetStorageService,
    @Inject(ICreateStorageServiceType)
    private readonly _createStorageService: ICreateStorageService,
    @Inject(ISetFirewallServiceType)
    private readonly _setFirewallService: ISetFirewallService,
    @Inject(ISetStorageServiceType)
    private readonly _setStorageService: ISetStorageService,
    @Inject(ISetEventServiceType)
    private readonly _setEventService: ISetEventService,
    @Inject(IRemoveConnectionFirewallServiceType)
    private readonly _removeConnectionFirewallService: IRemoveConnectionFirewallService,
    @Inject(IConfigType)
    private readonly _config: IConfig,
  ) {}

  async get(): Promise<Response<LoginRequirementDto[]>> {
    const res = newResponse<LoginRequirementDto[]>([]);

    // load data
    let loginRequirements: LoginRequirement[];
    const getAsyncRes = await this._getStorageService.getAsync();
    switch (getAsyncRes.errorCode) {
      case ErrorCode.SUCCESS:
        loginRequirements = getAsyncRes.results;
        break;
      default:
        return res.setMsg(ErrorCode.SYSTEM_FAIL);
    }

    res.results = loginRequirements.map(
      (loginRequirement: LoginRequirement) => {
        const plain = instanceToPlain(loginRequirement, {
          groups: ['client'],
        });
        return Object.assign(new LoginRequirementDto(), plain);
      },
    );

    return res;
  }

  async create(dto: LoginServiceDto): Promise<Response<void>> {
    const res = newResponse<void>();

    // ide login
    {
      const loginDto: IdeServiceLoginDto = {
        username: dto.username,
        psw: dto.psw,
        ip: dto.ip,
        otp: dto.otp,
      };
      const loginRes = await this._ideService.login(loginDto);
      switch (loginRes.errorCode) {
        case ErrorCode.SUCCESS:
          if (!loginRes.results) {
            return res.setMsg(ErrorCode.LOGIN_FAIL);
          }
          break;
        case ErrorCode.TIMEOUT:
          return res.setMsg(ErrorCode.TIMEOUT, 'IDE ');
        default:
          return res.setMsg(ErrorCode.SYSTEM_FAIL);
      }
    }

    // new login requirement
    let loginRequirement: LoginRequirement;
    {
      loginRequirement = new LoginRequirement({
        username: dto.username,
        description: dto.description,
        ip: dto.ip,
        requestTime: new Date(),
      });
    }

    // cache login requirement
    {
      const createAsyncRes =
        await this._createStorageService.createAsync(loginRequirement);
      switch (createAsyncRes.errorCode) {
        case ErrorCode.SUCCESS:
          break;
        case ErrorCode.EXISTING:
          const currentLoginRequirement = createAsyncRes.results;
          const requestTime = currentLoginRequirement.formatedRequestTime;
          return res.setMsg(
            ErrorCode.LOGIN_REQUIRED,
            `今日${requestTime ? requestTime : ''}`,
          );
        default:
          return res.setMsg(ErrorCode.SYSTEM_FAIL);
      }
    }

    return res;
  }

  async pass(dto: PassServiceDto): Promise<Response<string>> {
    let setDto = new SetServiceDto();
    setDto = Object.assign(setDto, dto);
    setDto.approval = true;
    return await this.set(setDto);
  }

  async deny(dto: DenyServiceDto): Promise<Response<string>> {
    let setDto = new SetServiceDto();
    setDto = Object.assign(setDto, dto);
    setDto.approval = false;
    return await this.set(setDto);
  }

  async set(dto: SetServiceDto): Promise<Response<string>> {
    const res = newResponse<string>();

    // load requirement
    let loginRequirement: LoginRequirement;
    {
      const getAsyncRes = await this._setStorageService.getAsync(dto.username);
      switch (getAsyncRes.errorCode) {
        case ErrorCode.SUCCESS:
          if (!getAsyncRes.results) return res.setMsg(ErrorCode.NOT_FOUND);

          loginRequirement = getAsyncRes.results;
          break;
        default:
          return res.setMsg(ErrorCode.SYSTEM_FAIL);
      }
    }

    // pass approval
    if (dto.approval) {
      // firewall enable
      {
        const enableRes =
          await this._setFirewallService.enable(loginRequirement);
        switch (enableRes.errorCode) {
          case ErrorCode.SUCCESS:
            break;
          case ErrorCode.EXEC_FAIL:
            return res.setMsg(ErrorCode.SETTING_FAIL, '防火牆');
          case ErrorCode.TIMEOUT:
            return res.setMsg(ErrorCode.TIMEOUT, '防火牆');
          default:
            return res.setMsg(ErrorCode.SYSTEM_FAIL);
        }
      }

      // set end time
      const endTime = new Date();
      endTime.setHours(
        endTime.getHours() + this._config.loginRequirement.enableHours,
      );

      // disable firwall at end time
      {
        const disableAsyncRes = await this._setEventService.disableAsync(
          loginRequirement,
          endTime,
        );
        switch (disableAsyncRes.errorCode) {
          case ErrorCode.SUCCESS:
            break;
          default:
            // firewall disable
            {
              const disableRes = await this._setFirewallService.disable(
                dto.username,
              );
              switch (disableRes.errorCode) {
                case ErrorCode.SUCCESS:
                  break;
                case ErrorCode.EXEC_FAIL:
                  return res.setMsg(ErrorCode.SETTING_FAIL, '防火牆');
                case ErrorCode.TIMEOUT:
                  return res.setMsg(ErrorCode.TIMEOUT, '防火牆');
                default:
                  return res.setMsg(ErrorCode.SYSTEM_FAIL);
              }
            }
            return res.setMsg(ErrorCode.SYSTEM_FAIL);
        }
      }

      // notify user connect time

      res.results = `許可 ${loginRequirement.username} 連線至${endTime.toLocaleTimeString()}`;
    } else {
      res.results = `拒絕 ${loginRequirement.username} 連線請求`;
    }

    // remove requirement
    {
      const removeAsyncRes =
        await this._setStorageService.removeAsync(loginRequirement);
      switch (removeAsyncRes.errorCode) {
        case ErrorCode.SUCCESS:
          break;
        default:
          return res.setMsg(ErrorCode.SYSTEM_FAIL);
      }
    }

    return res;
  }

  async removeConnectionAsync(
    dto: RemoveConnectionServiceDto,
  ): Promise<Response<void>> {
    const res = newResponse<void>();

    // firewall disable
    {
      const disableRes = await this._removeConnectionFirewallService.disable(
        dto.username,
      );
      switch (disableRes.errorCode) {
        case ErrorCode.SUCCESS:
          break;
        case ErrorCode.EXEC_FAIL:
          return res.setMsg(ErrorCode.SETTING_FAIL, '防火牆');
        case ErrorCode.TIMEOUT:
          return res.setMsg(ErrorCode.TIMEOUT, '防火牆');
        default:
          return res.setMsg(ErrorCode.SYSTEM_FAIL);
      }
    }

    return res;
  }
}
