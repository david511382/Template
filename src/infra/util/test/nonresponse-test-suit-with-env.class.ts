import { HttpException } from '@nestjs/common';
import { TestCase } from './test-case.class';
import { TestSuitWithEnv } from './test-suit-with-env.class';

export abstract class NonresponseTestSuitWithEnv<
  Target,
  Arg,
  Env,
> extends TestSuitWithEnv<Target, Arg, Error, Env> {
  async execute(
    testcase: TestCase<Arg, Error>,
    testTargetGetter: () => Target,
  ) {
    const testTarget = testTargetGetter();
    const arg = testcase.initArg();
    const expectRes = testcase.initRes();

    try {
      await this.executeTheFn(testTarget, arg);
      if (expectRes) {
        expect(null).toStrictEqual(expectRes);
      }
    } catch (actualRes) {
      if (actualRes instanceof HttpException) {
        const actualEx = actualRes;
        if (expectRes) {
          if (expectRes instanceof HttpException) {
            expect(actualEx.message).toStrictEqual(expectRes.message);
            expect(actualEx.getStatus()).toStrictEqual(expectRes.getStatus());
          } else {
            expect(actualEx.constructor.name).toBe(expectRes.constructor.name);
          }
        } else {
          expect(actualEx.message).toStrictEqual(undefined);
        }
      } else {
        const actualErr: Error = actualRes as Error;
        if (expectRes) {
          if (expectRes instanceof HttpException) {
            expect(actualErr.constructor.name).toBe(expectRes.constructor.name);
          } else {
            expect(actualErr.message).toStrictEqual(expectRes.message);
          }
        } else {
          expect(actualErr.message).toStrictEqual(undefined);
        }
      }
    }
  }

  protected abstract executeTheFn(testTarget: Target, arg: Arg);
}
