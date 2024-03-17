import { IntersectionType } from '@nestjs/swagger';
import { GetAccountMetadataDto } from './get-account-metadata.dto';

export class GetAccountMetadataServiceDto extends IntersectionType(
  GetAccountMetadataDto,
) {}
