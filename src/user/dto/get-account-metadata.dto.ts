import { ApiProperty } from '@nestjs/swagger';
import { PairDto } from '../../common/dto/pair.dto';

export class GetAccountMetadataDto {
  @ApiProperty({
    type: 'object',
    properties: {
      key: { type: 'string' },
      value: { type: 'string' },
    },
  })
  genders: PairDto<string, string>[];

  @ApiProperty({
    type: 'object',
    properties: {
      key: { type: 'string' },
      value: { type: 'string' },
    },
  })
  jobs: PairDto<string, string>[];

  @ApiProperty({
    type: 'object',
    properties: {
      key: { type: 'string' },
      value: { type: 'string' },
    },
  })
  langs: PairDto<string, string>[];

  @ApiProperty({
    type: 'object',
    properties: {
      key: { type: 'string' },
      value: { type: 'string' },
    },
  })
  engLevels: PairDto<string, string>[];
}
