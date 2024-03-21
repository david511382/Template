import { Exclude, Expose, Type, plainToInstance } from 'class-transformer';
import { IsString } from 'class-validator';

class LoginRequirementData {
  @IsString()
  username: string;

  @IsString()
  description: string;

  @IsString()
  ip: string;

  @Type(() => Date)
  requestTime: Date;

  constructor(partial?: Partial<LoginRequirementData>) {
    if (partial) {
      const data = plainToInstance(LoginRequirementData, partial);
      Object.assign(this, data);
    }
  }
}

@Exclude()
export class LoginRequirement {
  private _data: LoginRequirementData;

  constructor(partial?: Partial<LoginRequirementData>) {
    this._data = new LoginRequirementData(partial);
  }

  @Expose({ groups: [EntityExposeEnum.Store, 'client'] })
  get username(): string {
    return this._data.username;
  }

  @Expose({ groups: [EntityExposeEnum.Store, 'client'] })
  get description(): string {
    return this._data.description;
  }

  @Expose({ groups: [EntityExposeEnum.Store, 'client'] })
  get ip(): string {
    return this._data.ip;
  }

  @Expose({ groups: [EntityExposeEnum.Store] })
  get requestTime(): Date {
    return this._data.requestTime;
  }

  @Expose({ name: 'requestTime', groups: ['client'] })
  get formatedRequestTime(): string {
    return this.requestTime.toLocaleTimeString();
  }
}
