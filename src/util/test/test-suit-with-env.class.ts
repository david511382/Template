import { IAdditionalCheckTestcaseWithEnv } from './interface/additional-check-test-case-with-env.interface';
import { TestCaseWithEnv } from './test-case-with-env.class';
import { TestCase } from './test-case.class';
import { TestSuit } from './test-suit.class';

export abstract class TestSuitWithEnv<Target, Arg, Res, Env> extends TestSuit<
  Target,
  Arg,
  Res
> {
  constructor(
    testTargetGetter: () => Target,
    private readonly testEnvGetter: () => Env,
  ) {
    super(testTargetGetter);
  }

  protected async beforeExecute(tc: TestCase<Arg, Res>) {
    await this.defaultInitEnv(this.testEnvGetter);

    const testcase: TestCaseWithEnv<Arg, Res, Env> = tc as TestCaseWithEnv<
      Arg,
      Res,
      Env
    >;
    await testcase.initEnv(this.testEnvGetter);
  }

  protected async additionalCheck(
    tc: IAdditionalCheckTestcaseWithEnv<Target, Env>,
    testTargetGetter: () => Target,
  ) {
    await tc.additionalCheck(testTargetGetter, this.testEnvGetter);
  }

  protected async defaultInitEnv(testEnvGetter: () => Env) {}
}
