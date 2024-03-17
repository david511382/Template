import { CreateAdpModule } from "./create-adp/create-adp.module";
import { UpdateAdpModule } from "./update-adp/update-adp.module";

export const serviceImports = [];
export const adpImports = [CreateAdpModule,UpdateAdpModule];
