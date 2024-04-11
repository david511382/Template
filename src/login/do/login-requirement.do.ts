import { Expose, plainToInstance } from 'class-transformer';
import { LoginRequirementEntity } from '../entities/login-requirement.enetity';
import { EntityExposeEnum } from '../../common/enum/expose.enum';
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { toDate, toMoment } from '../../util/time.';
import { Response, newResponse } from '../../common/entities/response.entity';
import { ErrorCode } from '../../common/error/error-code.enum';

export type LoginRequirementEntityRecord = {
  [K in keyof LoginRequirementDo]?: LoginRequirementDo[K];
};

export const CODE_MAX_LENGTH = 15;

export class LoginRequirementDo {
  private _entity: LoginRequirementEntity;

  @IsNumber()
  @Expose({})
  get id(): bigint {
    return this._entity.id;
  }
  private set id(i: bigint) {
    this._entity.id = i;
  }

  @IsString()
  @Expose({})
  get username(): string {
    return this._entity.username;
  }
  private set username(s: string) {
    this._entity.username = s;
  }

  @IsString()
  @Expose({})
  get description(): string {
    return this._entity.description;
  }
  private set description(s: string) {
    this._entity.description = s;
  }

  @IsString()
  @Expose({})
  @MaxLength(15)
  get ip(): string {
    return this._entity.ip;
  }
  private set ip(s: string) {
    this._entity.ip = s;
  }

  @IsDate()
  @Expose({})
  get requestTime(): Date {
    return this.entity.requestTime;
  }
  set requestTime(t: Date) {
    this.entity.requestTime = t;
    this.requestDate = toDate(this.requestTime);
  }

  @IsDate()
  @Expose({})
  get requestDate(): Date {
    return this.entity.requestDate;
  }
  private set requestDate(d: Date) {
    this._entity.requestDate = d;
  }

  @IsString()
  @Expose({})
  get applyUsername(): string {
    return this._entity.applyUsername;
  }
  set applyUsername(s: string) {
    this._entity.applyUsername = s;
  }

  @IsDate()
  @Expose({})
  get applyTime(): Date {
    return this.entity.applyTime;
  }
  set applyTime(t: Date) {
    this.entity.applyTime = t;
    this.entity.applyDate = toDate(this.entity.applyTime);
  }

  @IsDate()
  @Expose({})
  get applyDate(): Date {
    return this.entity.applyDate;
  }

  @IsBoolean()
  @Expose({})
  get approval(): boolean {
    return this.entity.approval;
  }
  set approval(b: boolean) {
    this.entity.approval = b;
  }
  get isComfirmed(): boolean {
    return this.entity.approval != undefined;
  }

  @IsDate()
  @Expose({})
  get connectTime(): Date {
    return this._entity.connectTime;
  }
  private set connectTime(t: Date) {
    this.entity.connectTime = t;
  }
  get connectEndTime(): Date {
    if (!this.connectTime) return undefined;

    return new Date(
      toMoment(this.connectTime).add(this._enableHours, 'hour').valueOf(),
    );
  }

  @IsNumber()
  @Expose({})
  get code(): string {
    return this._entity.code;
  }
  private set code(s: string) {
    this._entity.code = s;
  }

  get entity(): LoginRequirementEntity {
    return this._entity;
  }

  constructor(
    private readonly _enableHours: number,
    partial?: Readonly<LoginRequirementEntityRecord> | LoginRequirementEntity,
  ) {
    this._entity = new LoginRequirementEntity();
    if (partial) {
      if (partial instanceof LoginRequirementEntity) {
        this._entity = partial;
      } else {
        const data = plainToInstance(LoginRequirementDo, partial, {
          groups: [EntityExposeEnum.Create],
        });
        this._entity = data._entity;
      }
      this.requestTime = this.requestTime;
      this.applyTime = this.applyTime;
    }
  }

  setConnectTime(t: Date): Response<void> {
    // 為了限制廠商連線時間，連線時間必須與申請時間同天
    const res = newResponse<void>();

    const m = toMoment(t);
    if (m >= toMoment(this.requestDate).add(1, 'day')) {
      return res.setMsg(ErrorCode.WRONG_INPUT);
    }

    // 連線時間只精準到分
    const mMin = m.startOf('minute');
    this._entity.connectTime = new Date(mMin.valueOf());

    return res;
  }

  setCode(s?: string): Response<void> {
    const res = newResponse<void>();

    if (s && s.length > CODE_MAX_LENGTH) {
      return res.setMsg(ErrorCode.WRONG_INPUT);
    }

    this.code = s;

    return res;
  }
}
