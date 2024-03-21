import { Expose, instanceToInstance, instanceToPlain, plainToInstance } from 'class-transformer';
import { PASSWORD_MIN_LEN } from '../const/user-constraint.const';
import { GenderEnum } from '../enum/gender.enum';
import { IPswHash } from '../interface/psw-hash.interface';
import { ErrorCode } from '../../common/error/error-code.enum';
import { Response, newResponse } from '../../common/response';
import { UtmEntity } from '../entities/utm.entity';
import {  UserEntity } from '../entities/user.entity';
import { UserEditableDto } from '../dto/user-editable.dto';

export class UserDo {
  private _entity: UserEntity;
  private _utmEntity: UtmEntity;
  
  constructor(
    private readonly _pswHash: IPswHash,
    userPartial?: Partial<UserEntity>,
    utmPartial?: Partial<UtmEntity>,
  ) {
    this._entity = new UserEntity(userPartial);
    if (utmPartial)this._utmEntity= new UtmEntity(utmPartial);
  }

  @Expose({groups: [] })
  get id(): number {
    return this._entity.id;
  }
  
    @Expose({groups: [] })
    get email(): string {
      return this._entity.email;
    }

  @Expose({ name: 'first_name', groups: [] })
  get firstName(): string {
    return this._entity.firstName;
  }
  
  @Expose({ name: 'last_name', groups: [] })
  get lastName(): string {
    return this._entity.lastName;
  }
  
  @Expose({groups: [] })
  get gender(): GenderEnum {
    return this._entity.gender;
  }
  set gender(gender: GenderEnum) {
    this._entity.gender = gender;
  }
  
  get password(): string {
    return this._entity.password;
  }
  
  @Expose({groups: [] })
  get birthday(): Date {
    return this._entity.birthday;
  }
  set birthday(birthday: Date) {
    this._entity.birthday = birthday;
  }
  
  @Expose({ name: 'utm_campaign', groups: [] })
  get utmCampaign(): string {
    return this._utmEntity?.campaign;
  }
  
  @Expose({ name: 'utm_medium', groups: [] })
  get utmMedium(): string {
    return this._utmEntity?.medium;
  }
  
  @Expose({ name: 'utm_source', groups: [] })
  get utmSource(): string {
    return this._utmEntity?.source;
  }
  
  get  entity(): UserEntity {
      return this._entity;
    }
  
  get  utmEntity(): UtmEntity {
      return this._utmEntity;
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
          this._entity.password = hashAsyncRes.results;
          break;
        default:
          return res.setMsg(ErrorCode.SYSTEM_FAIL);
      }
    }
  
    return res;
  }
  
  async setAsync(
    dto: Partial<UserEditableDto>,
  ): Promise<Response<void>> {
    const res = newResponse<void>();

    try{
    const plain= instanceToPlain(dto,{excludeExtraneousValues:true});
    // verify
    const entity= plainToInstance(UserEntity, plain,{excludeExtraneousValues:true,exposeUnsetFields:false});
    // set
    Object.assign(this._entity,entity);
    }catch(e){
return res.setMsg(ErrorCode.WRONG_INPUT,e);
    }

    // Check User Constraints
    if (dto.password){
      const setPasswordRes = await this.setPassword(dto.password);
      switch (setPasswordRes.msg) {
        case ErrorCode.SUCCESS:
          break;
        default:
          return setPasswordRes;
      }
    }

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
}
