import { DbModule } from '../../infra/db/db.module';
import { FindModule } from '../find/find.module';

export const infraImports = [DbModule];
export const serviceImports = [FindModule];
