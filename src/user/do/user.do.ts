import { Expose } from 'class-transformer';
import { IsDate, IsEmail, IsEnum, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { PASSWORD_MIN_LEN } from '../const/user-constraint.const';
import { GenderEnum } from '../enum/gender.enum';
import { IPswHash } from '../interface/psw-hash.interface';
import { ErrorCode } from '../../common/error/error-code.enum';
import { Response, newResponse } from '../../common/response';
import { UtmEntity } from '../entities/utm.entity';
import {  UserEntity } from '../entities/user.entity';
import { UserEditableDto } from '../dto/user-editable.dto';



export class UserDo {
  private _props: UserEntity;
  private _utmEntity: UtmEntity;
  
  constructor(
    private readonly _pswHash: IPswHash,
    partial?: Partial<UserEntity>,
  ) {
    this._props = new UserEntity();
    if (partial) Object.assign(this._props, partial);
  }

  async setAsync(
    dto: Partial<UserEditableDto>,
  ): Promise<Response<void>> {
    const res = newResponse<void>();

    // Check User Constraints
    {
      const setPasswordRes = await this.setPassword(dto.password);
      switch (setPasswordRes.msg) {
        case ErrorCode.SUCCESS:
          break;
        default:
          return setPasswordRes;
      }
    }
    this.birthday = dto.birthday;
    this.firstName = dto.firstName;
    this.gender = dto.gender;
    this.lastName = dto.lastName;

    return res;
  }

  async verifyPasswordAsync(psw: string): Promise<Response<boolean>> {
    const res = newResponse<boolean>(false);

    const checkAsyncRes = await this._pswHash.checkAsync(psw, this.password);
    switch (checkAsyncRes.msg) {
      case ErrorCode.SUCCESS:
        res.results = true;
        break;
      default:
        return res.setMsg(ErrorCode.SYSTEM_FAIL);
    }

    return res;
  }

  @IsNumber()
  @Expose({ name: 'id', groups: ['store', 'client'] })
  get id(): number {
    return this._props.id;
  }
  
    @IsEmail()  
    @Expose({ name: 'email', groups: ['store', 'client'] })
    @MaxLength(128)
    get email(): string {
      return this._props.email;
    }
    set email(email: string) {
      this._props.email = email;
    }

  @IsString()
  @Expose({ name: 'first_name', groups: ['store', 'client'] })
  @MaxLength(16)
  get firstName(): string {
    return this._props.firstName;
  }
  set firstName(firstName: string) {
    this._props.firstName = firstName;
  }
  
  @IsString()
  @Expose({ name: 'last_name', groups: ['store', 'client'] })
  @MaxLength(16)
  get lastName(): string {
    return this._props.lastName;
  }
  set lastName(lastName: string) {
    this._props.lastName = lastName;
  }
  
  @IsEnum(GenderEnum)
  @Expose({ name: 'gender', groups: ['store', 'client'] })
  get gender(): GenderEnum {
    return this._props.gender;
  }
  set gender(gender: GenderEnum) {
    this._props.gender = gender;
  }
  
  @IsString()
  @Expose({ name: 'password', groups: ['store'] })
  get password(): string {
    return this._props.password;
  }

  @IsDate()  
  @Expose({ name: 'birthday', groups: ['store', 'client'] })
  get birthday(): Date {
    return this._props.birthday;
  }
  set birthday(birthday: Date) {
    this._props.birthday = birthday;
  }
  
  @IsString()
  @Expose({ name: 'utm_campaign', groups: ['store', 'client'] })
  @IsOptional()
  get utmCampaign(): string {
    return this._utmEntity?.campaign;
  }
  
  @IsString()
  @Expose({ name: 'utm_medium', groups: ['store', 'client'] })
  @IsOptional()
  get utmMedium(): string {
    return this._utmEntity?.medium;
  }

  @IsString()
  @Expose({ name: 'utm_source', groups: ['store', 'client'] })
  @IsOptional()
  get utmSource(): string {
    return this._utmEntity?.source;
  }

  async setPassword(password: string): Promise<Response<void>> {
    const res = newResponse<void>();
    
    if (password.length < PASSWORD_MIN_LEN) {
      return res.setMsg(ErrorCode.WRONG_PASSWORD_LENGTH) ;
    }
  
    {
      const hashAsyncRes = await this._pswHash.hashAsync(password);
      switch (hashAsyncRes.msg) {
        case ErrorCode.SUCCESS:
          // char 64
          this._props.password = hashAsyncRes.results;
          break;
        default:
          return res.setMsg(ErrorCode.SYSTEM_FAIL);
      }
    }
  
    return res;
  }

  expose(): UserEntity {
    return Object.assign({}, this._props);
  }
  
  toJSON(): string {
    return JSON.stringify(this._props);
  }
  
  parseJSON(json: string): this {
    const data = JSON.parse(json);
    this._props = data;
    return this;
  }
}
