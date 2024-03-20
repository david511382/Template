import { CreateAdpModule } from './create-adp/create-adp.module';
import { FindAdpModule } from './find-adp/find-adp.module';

export const infraImports = [];
export const serviceImports = [];
export const adpImports = [CreateAdpModule, FindAdpModule];
