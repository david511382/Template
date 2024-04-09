import { HttpLogger } from '../http-logger';

export interface IHttpLoggerFactory {
  create(partial?: Partial<HttpLogger>): Promise<HttpLogger>;
}

export const IHttpLoggerFactoryType = Symbol('IHttpLoggerFactory');
