import { PickType } from '@nestjs/swagger';
import { LoginRequirementDo } from '../do/login-requirement.do';

export class GetStorageGetDto extends PickType(LoginRequirementDo, [
  'requestDate',
  'applyUsername',
] as const) {}
