import { CreateAdpModule } from './create-adp/create-adp.module';
import { FindAdpModule } from './find-adp/find-adp.module';
import { IsExistAdpModule } from './is_exist-adp/is-exist-adp.module';
import { UpdateAdpModule } from './update-adp/update-adp.module';

export const serviceImports = [];
export const adpImports = [
  CreateAdpModule,
  FindAdpModule,
  UpdateAdpModule,
  IsExistAdpModule,
];
