import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsEnum,
  IsDateString,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { EngLevelEnum } from '../enum/eng-level.enum';
import { GenderEnum } from '../enum/gender.enum';
import { JobEnum } from '../enum/job.enum';
import { LangEnum } from '../enum/lang.enum';
import { Expose } from 'class-transformer';

export class AccountServiceDto {
  constructor(partial?: Partial<AccountServiceDto>) {
    if (partial) Object.assign(this, partial);
  }

  @IsNumber()
  @Expose({ name: 'id' })
  @ApiProperty({
    name: 'id',
  })
  id: number;

  @IsString()
  @Expose({ name: 'first_name' })
  @ApiProperty({
    name: 'first_name',
  })
  firstName: string;

  @IsString()
  @Expose({ name: 'last_name' })
  @ApiProperty({
    name: 'last_name',
  })
  lastName: string;

  @IsEmail()
  @Expose({ name: 'email' })
  @ApiProperty({
    name: 'email',
    description: 'email',
  })
  email: string;

  @IsString()
  @Expose({ name: 'password' })
  @ApiProperty({
    name: 'password',
    description: 'password',
  })
  password: string;

  @IsEnum(LangEnum)
  @Expose({ name: 'lang' })
  @ApiProperty({
    name: 'lang',
    description: 'language',
    enum: LangEnum,
  })
  lang: LangEnum;

  @IsString()
  @Expose({ name: 'residency' })
  @ApiProperty({
    name: 'residency',
    description: 'residency code',
  })
  residency: string;

  @IsDateString()
  @Expose({ name: 'birthday' })
  @ApiProperty({
    name: 'birthday',
    description: 'birthday',
    type: Date,
  })
  birthday: Date;

  @IsEnum(GenderEnum)
  @Expose({ name: 'gender' })
  @ApiProperty({
    name: 'gender',
    description: 'gender',
    enum: GenderEnum,
  })
  gender: GenderEnum;

  @IsEnum(EngLevelEnum)
  @Expose({ name: 'eng_level' })
  @ApiProperty({
    name: 'eng_level',
    description: 'english Level',
    enum: EngLevelEnum,
  })
  engLevel: EngLevelEnum;

  @IsEnum(JobEnum)
  @Expose({ name: 'job' })
  @ApiProperty({
    name: 'job',
    description: 'job title',
    enum: JobEnum,
  })
  job: JobEnum;

  @IsString()
  @IsOptional()
  @Expose({ name: 'utm_campaign' })
  @ApiProperty({
    name: 'utm_campaign',
    description: 'utm campaign',
    required: false,
  })
  utmCampaign?: string;

  @IsString()
  @IsOptional()
  @Expose({ name: 'utm_medium' })
  @ApiProperty({
    name: 'utm_medium',
    description: 'utm medium',
    required: false,
  })
  utmMedium?: string;

  @IsString()
  @IsOptional()
  @Expose({ name: 'utm_source' })
  @ApiProperty({
    name: 'utm_source',
    description: 'utm source',
    required: false,
  })
  utmSource?: string;
}
