import { Expose } from 'class-transformer';
import { IsDate, IsEmail, IsEnum, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { GenderEnum } from '../enum/gender.enum';
import { OmitType } from '@nestjs/swagger';

export class UserEntity {
  constructor(partial?: Partial<UserEntity>) {
    if (partial) Object.assign(this, partial);
  }
  
  @IsNumber()
  @Expose({ name: 'id', groups: ['store', 'client'] })
  id: number;
  
  @IsEmail()
  @Expose({ name: 'email', groups: ['store', 'client'] })
  @MaxLength(128)
  email: string;
  
  @IsString()
  @Expose({ name: 'first_name', groups: ['store', 'client'] })
  @MaxLength(16)
  firstName: string;
  
  @IsString()
  @Expose({ name: 'last_name', groups: ['store', 'client'] })
  @MaxLength(16)
  lastName: string;
  
  @IsEnum(GenderEnum)
  @Expose({ name: 'gender', groups: ['store', 'client'] })
  gender: GenderEnum;
  
  @IsString()
  @Expose({ name: 'password', groups: ['store'] })
  @MaxLength(64)
  password: string;
  
  @IsDate()
  @Expose({ name: 'birthday', groups: ['store', 'client'] })
  birthday: Date;
}
