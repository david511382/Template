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

  @Expose({ groups: ['store', 'client'] })
  get username(): string {
    return this._data.username;
  }

  @Expose({ groups: ['store', 'client'] })
  get description(): string {
    return this._data.description;
  }

  @Expose({ groups: ['store', 'client'] })
  get ip(): string {
    return this._data.ip;
  }

  @Expose({ groups: ['store'] })
  get requestTime(): Date {
    return this._data.requestTime;
  }

  @Expose({ name: 'requestTime', groups: ['client'] })
  get formatedRequestTime(): string {
    return this.requestTime.toLocaleTimeString();
  }
}
