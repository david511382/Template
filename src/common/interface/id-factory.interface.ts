export interface IIdFactory {
  string(): string;
}

export const IIdFactoryType = Symbol('IIdFactory');
