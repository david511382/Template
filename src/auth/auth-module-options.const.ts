import { IInternalSignServiceType } from '../common/interface/internal-sign.interface';
import { ISignServiceType } from './interface/sign.interface';
import { SignModule } from './sign/sign.module';

export const serviceImports = [];
export const adpImports = [
  SignModule.register({ token: ISignServiceType, expiresIn: '1h' }),
  SignModule.register({
    token: IInternalSignServiceType,
    expiresIn: undefined,
  }),
];
