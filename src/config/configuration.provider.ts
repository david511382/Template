import { IConfigType } from './interface/config.interface';
import {
  IConfigFactory,
  IConfigFactoryType,
} from './interface/config-factory.interface';

export default {
  provide: IConfigType,
  useFactory: (configFactory: IConfigFactory) => configFactory.create(),
  inject: [{ token: IConfigFactoryType, optional: false }],
};
