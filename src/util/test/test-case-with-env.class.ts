import { TestCase } from './test-case.class';

export type TestCaseWithEnvClass<Arg, Res, Env> = new () => TestCaseWithEnv<
  Arg,
  Res,
  Env
>;

export abstract class TestCaseWithEnv<Arg, Res, Env> extends TestCase<
  Arg,
  Res
> {
  abstract initEnv(testEnvGetter: () => Env): any;
}
