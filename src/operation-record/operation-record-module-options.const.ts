import { CreateAdpModule } from './create-adp/create-adp.module';
import { FindAdpModule } from '../user/find-adp/find-adp.module';

export const infraImports = [];
export const serviceImports = [];
export const adpImports = [CreateAdpModule, FindAdpModule];
