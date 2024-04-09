import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { LoginRequirementDo } from './do/login-requirement.do';
import { newResponse, Response } from '../common/entities/response.entity';
import { ErrorCode } from '../common/error/error-code.enum';
import { LoginRequirementCreateDto } from './dto/login-requirement-create.dto';
import {
  IIdeService,
  IIdeServiceType,
} from './interface/ide-service.interface';
import { IdeServiceLoginDto } from './dto/ide-service-login.dto';
import { LoginRequirementVo } from './dto/login-requirement.vo';
import { instanceToInstance, instanceToPlain } from 'class-transformer';
import { PassDto } from './dto/pass.dto';
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
  IEnableConnectionFirewallService,
  IEnableConnectionFirewallServiceType,
} from './interface/enable-connection-firewall-service.interface';
import { DenyDto } from './dto/deny.dto';
import { SetDto } from './dto/login-requirement-set.dto';
import {
  ISetEventService,
  ISetEventServiceType,
} from './interface/set-event-service.interface';
import { RemoveConnectionDto } from './dto/remove-connection.dto';
import {
  IRemoveConnectionFirewallService,
  IRemoveConnectionFirewallServiceType,
} from './interface/remove-connection-firewall-service.interface';
import { toDate, toMoment } from '../util/time.';
import { SetVo } from './dto/login-requirement-set.vo';
import { LoginRequirementFactory } from './login-requirement-factory';
import { EnableConnectionDto } from './dto/enable-connection.dto';
import { ILoggerServiceType } from '../infra/log/interface/logger.interface';

@Injectable()
export class LoginService {
  constructor(
    @Inject(IIdeServiceType) private readonly _ideService: IIdeService,
    @Inject(IGetStorageServiceType)
    private readonly _getStorageService: IGetStorageService,
    @Inject(ICreateStorageServiceType)
    private readonly _createStorageService: ICreateStorageService,
    @Inject(IEnableConnectionFirewallServiceType)
    private readonly _enableConnectionFirewallService: IEnableConnectionFirewallService,
    @Inject(ISetStorageServiceType)
    private readonly _setStorageService: ISetStorageService,
    @Inject(ISetEventServiceType)
    private readonly _setEventService: ISetEventService,
    @Inject(IRemoveConnectionFirewallServiceType)
    private readonly _removeConnectionFirewallService: IRemoveConnectionFirewallService,
    private readonly _loginRequirementFactory: LoginRequirementFactory,
    @Inject(ILoggerServiceType)
    private readonly _logger: LoggerService,
  ) {}

  async get(): Promise<Response<LoginRequirementVo[]>> {
    const res = newResponse<LoginRequirementVo[]>([]);

    const now = new Date();
    const today = toDate(now);

    // load data
    let loginRequirements: LoginRequirementDo[];
    const getAsyncRes = await this._getStorageService.getAsync({
      requestDate: today,
      applyUsername: null,
    });
    switch (getAsyncRes.errorCode) {
      case ErrorCode.SUCCESS:
        loginRequirements = getAsyncRes.results;
        break;
      default:
        return res.setMsg(ErrorCode.SYSTEM_FAIL);
    }

    res.results = loginRequirements.map(
      (loginRequirement: LoginRequirementDo) => {
        const plain = instanceToPlain(loginRequirement, {
          excludeExtraneousValues: true,
        });
        return new LoginRequirementVo(plain);
      },
    );

    return res;
  }

  async create(dto: LoginRequirementCreateDto): Promise<Response<Date>> {
    const res = newResponse<Date>();

    const now = new Date();

    // init connect time
    if (!dto.connectTime) dto.connectTime = now;

    // new login requirement
    let loginRequirement: LoginRequirementDo;
    {
      loginRequirement = this._loginRequirementFactory.create({
        username: dto.username,
        description: dto.description,
        ip: dto.ip,
        requestTime: now,
      });
      const setConnectTimeRes = loginRequirement.setConnectTime(
        dto.connectTime,
      );
      if (setConnectTimeRes.errorCode != ErrorCode.SUCCESS) {
        return res.setMsg(setConnectTimeRes.errorCode);
      }
    }

    // set end time
    const endT = loginRequirement.connectEndTime.valueOf();

    // check requirement
    {
      // find today's login requirement
      let todayLoginRequirements: LoginRequirementDo[] = [];
      {
        const connectDate = toDate(loginRequirement.connectTime);
        const findAsyncRes = await this._createStorageService.findAsync({
          usernam: dto.username,
          date: connectDate,
        });
        switch (findAsyncRes.errorCode) {
          case ErrorCode.SUCCESS:
            todayLoginRequirements = findAsyncRes.results;
            break;
          default:
            return res.setMsg(ErrorCode.SYSTEM_FAIL);
        }
      }

      const connectT = loginRequirement.connectTime.valueOf();
      todayLoginRequirements.forEach((todayLoginRequirement) => {
        const todayLoginRequirementConnectT =
          todayLoginRequirement.connectTime.valueOf();
        const todayLoginRequirementConnectEndT =
          todayLoginRequirement.connectEndTime.valueOf();
        if (todayLoginRequirement.isComfirmed) {
          if (todayLoginRequirement.approval) {
            // 連線時間不得與核准連線時間相同
            if (connectT === todayLoginRequirementConnectT) {
              return res.setMsg(ErrorCode.EXISTING);
            }
          }
        } else {
          // 連線時間不得於未批核連線區間之中
          const c1 =
            connectT >= todayLoginRequirementConnectT &&
            connectT < todayLoginRequirementConnectEndT;
          // 連線結束時間不得於未批核連線區間之中
          const c2 =
            endT > todayLoginRequirementConnectT &&
            endT <= todayLoginRequirementConnectEndT;
          if (c1 || c2) {
            return res.setMsg(ErrorCode.EXISTING);
          }
        }
      });
    }

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

    // save login requirement
    {
      const createAsyncRes =
        await this._createStorageService.createAsync(loginRequirement);
      switch (createAsyncRes.errorCode) {
        case ErrorCode.SUCCESS:
          break;
        default:
          return res.setMsg(ErrorCode.SYSTEM_FAIL);
      }
    }

    res.results = loginRequirement.connectTime;

    return res;
  }

  async pass(dto: PassDto): Promise<Response<SetVo>> {
    let setDto = new SetDto();
    setDto = Object.assign(setDto, dto);
    setDto.approval = true;
    return await this.set(setDto);
  }

  async deny(dto: DenyDto): Promise<Response<SetVo>> {
    let setDto = new SetDto();
    setDto = Object.assign(setDto, dto);
    setDto.approval = false;
    return await this.set(setDto);
  }

  async set(dto: SetDto): Promise<Response<SetVo>> {
    const res = newResponse<SetVo>();

    const now = new Date();

    // load requirement
    let loginRequirement: LoginRequirementDo;
    const approvaledLoginRequirements: LoginRequirementDo[] = [];
    {
      const getAndSameDayApprovaledAsyncRes =
        await this._setStorageService.getAndSameDayApprovaledAsync(dto.id);
      switch (getAndSameDayApprovaledAsyncRes.errorCode) {
        case ErrorCode.SUCCESS:
          break;
        default:
          return res.setMsg(ErrorCode.SYSTEM_FAIL);
      }

      getAndSameDayApprovaledAsyncRes.results.forEach((l) => {
        if (l.id === dto.id) {
          loginRequirement = l;
          return;
        }
        approvaledLoginRequirements.push(l);
      });
      if (!loginRequirement) return res.setMsg(ErrorCode.NOT_FOUND);
    }

    // update requirement
    loginRequirement.approval = dto.approval;
    loginRequirement.applyTime = now;
    loginRequirement.applyUsername = dto.applyUsername;

    // pass approval
    if (dto.approval) {
      // set end time
      let endTime = loginRequirement.connectEndTime;
      let endT = endTime.valueOf();

      // check overlap
      /**
       * 延續的
       */
      let extendFrom: LoginRequirementDo;
      /**
       * 後面連接的
       */
      let extendedBy: LoginRequirementDo;
      {
        const connectT = loginRequirement.connectTime.valueOf();
        approvaledLoginRequirements.forEach((approvaledLoginRequirement) => {
          const approvaledLoginRequirementConnectT =
            approvaledLoginRequirement.connectTime.valueOf();
          const approvaledLoginRequirementConnectEndT =
            approvaledLoginRequirement.connectEndTime.valueOf();
          // 連線時間得於核准連線區間之中
          const c1 =
            connectT > approvaledLoginRequirementConnectT &&
            connectT <= approvaledLoginRequirementConnectEndT;
          // 連線結束時間得於核准連線區間之中
          const c2 =
            endT >= approvaledLoginRequirementConnectT &&
            endT <= approvaledLoginRequirementConnectEndT;
          if (c1) {
            // have to reset disable firewall time
            if (
              !extendFrom ||
              extendFrom.connectTime.valueOf() <
                approvaledLoginRequirement.connectTime.valueOf()
            )
              extendFrom = approvaledLoginRequirement;
          } else if (c2) {
            // have to extend disable firewall time
            if (
              !extendedBy ||
              extendedBy.connectTime.valueOf() <
                approvaledLoginRequirement.connectTime.valueOf()
            )
              extendedBy = approvaledLoginRequirement;
          }
        });
      }

      // update end time
      if (extendedBy) {
        endTime = extendedBy.connectEndTime;
        endT = endTime.valueOf();
      }

      let isSkipEnable = false;
      if (extendedBy) {
        // reset disable firewall time
        const cancelIfExistAsyncRes =
          await this._setEventService.cancelIfExistAsync(extendedBy, true);
        switch (cancelIfExistAsyncRes.errorCode) {
          case ErrorCode.SUCCESS:
            break;
          default:
          // 關閉啟動失敗，但重複啟動沒關係
        }
      } else {
        // disable firwall at end time
        const disableAsyncRes = await this._setEventService.disableAsync(
          loginRequirement,
          endTime,
        );
        switch (disableAsyncRes.errorCode) {
          case ErrorCode.SUCCESS:
            break;
          case ErrorCode.PAST_DATE:
            isSkipEnable = true;
            break;
          default:
            this._logger.error(disableAsyncRes.errorCode);
            return res.setMsg(ErrorCode.SYSTEM_FAIL);
        }
      }

      // firewall enable
      if (!isSkipEnable) {
        if (extendFrom) {
          // extend disable firewall time
          const cancelIfExistAsyncRes =
            await this._setEventService.cancelIfExistAsync(extendFrom, false);
          switch (cancelIfExistAsyncRes.errorCode) {
            case ErrorCode.SUCCESS:
              break;
            default:
              // 應該要 retry or rollback，但沒時間做
              return res.setMsg(ErrorCode.SYSTEM_FAIL);
          }
        } else {
          // enable firwall at connect time
          const enableAsyncRes =
            await this._setEventService.enableAsync(loginRequirement);
          switch (enableAsyncRes.errorCode) {
            case ErrorCode.SUCCESS:
              break;
            case ErrorCode.PAST_DATE:
              const lastConnectT = toMoment(endTime).add(-1, 'minute');
              const copy = instanceToInstance(loginRequirement);
              // 因為使用排程連線，連線時間須為未來時間
              const nowConnectTime = toMoment(now).add(1, 'minute').toDate();
              const setConnectTimeRes = copy.setConnectTime(nowConnectTime);
              switch (setConnectTimeRes.errorCode) {
                case ErrorCode.SUCCESS:
                  if (copy.connectTime.valueOf() > lastConnectT.valueOf()) {
                    // 時間超過最晚容許連線時間，不須啟用
                  } else {
                    const enableAsyncRes =
                      await this._setEventService.enableAsync(copy);
                    switch (enableAsyncRes.errorCode) {
                      case ErrorCode.SUCCESS:
                      case ErrorCode.PAST_DATE:
                        break;
                      default:
                        // 應該要 retry or rollback，但沒時間做
                        return res.setMsg(ErrorCode.SYSTEM_FAIL);
                    }
                  }
                  break;
                case ErrorCode.WRONG_INPUT:
                  // 表示連線申請時間不合理，不須啟用
                  break;
                default:
                  return res.setMsg(ErrorCode.SYSTEM_FAIL);
              }
            default:
              // 應該要 retry or rollback，但沒時間做
              return res.setMsg(ErrorCode.SYSTEM_FAIL);
          }
        }
      }

      res.results = new SetVo({
        username: loginRequirement.username,
        endTime,
      });
    } else {
      res.results = new SetVo({
        username: loginRequirement.username,
      });
    }

    // finish requirement
    {
      const updaterAsyncRes =
        await this._setStorageService.updaterAsync(loginRequirement);
      switch (updaterAsyncRes.errorCode) {
        case ErrorCode.SUCCESS:
          break;
        default:
          // 應該要 retry or rollback，但沒時間做
          return res.setMsg(ErrorCode.SYSTEM_FAIL);
      }
    }

    return res;
  }

  async enableConnectionAsync(
    dto: EnableConnectionDto,
  ): Promise<Response<void>> {
    const res = newResponse<void>();

    // load
    let loginRequirement: LoginRequirementDo;
    {
      const getRes = await this._enableConnectionFirewallService.getAsync(
        dto.id,
      );
      switch (getRes.errorCode) {
        case ErrorCode.SUCCESS:
          loginRequirement = getRes.results;
          break;
        default:
          return res.setMsg(ErrorCode.SYSTEM_FAIL);
      }
    }

    // firewall enable
    {
      const enableRes =
        await this._enableConnectionFirewallService.enable(loginRequirement);
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

    return res;
  }

  async removeConnectionAsync(
    dto: RemoveConnectionDto,
  ): Promise<Response<void>> {
    const res = newResponse<void>();

    // load
    let loginRequirement: LoginRequirementDo;
    {
      const getRes = await this._removeConnectionFirewallService.getAsync(
        dto.id,
      );
      switch (getRes.errorCode) {
        case ErrorCode.SUCCESS:
          loginRequirement = getRes.results;
          break;
        default:
          return res.setMsg(ErrorCode.SYSTEM_FAIL);
      }
    }

    // firewall disable
    {
      const disableRes =
        await this._removeConnectionFirewallService.disable(loginRequirement);
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
