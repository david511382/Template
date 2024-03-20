import { IConfig } from './config.interface';

export interface IConfigFactory {
  create(): IConfig;
}

export const IConfigFactoryType = Symbol('IConfigFactory');
