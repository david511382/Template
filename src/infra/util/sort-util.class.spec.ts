import { SortUtil } from './sort-util.class';
import { TestCase, TestCaseClass } from './test/test-case.class';
import { TestSuit } from './test/test-suit.class';

class CompareTest extends TestSuit<
  (a: any, b: any) => number,
  { a: any; b: any },
  number
> {
  protected testcasesClasses: TestCaseClass<{ a: any; b: any }, number>[] = [
    NumberTest,
    ObjectTest,
  ];

  execute(
    testcase: TestCase<{ a: any; b: any }, number>,
    testTargetGetter: () => (a: any, b: any) => number,
  ) {
    const testTarget = testTargetGetter();
    const arg = testcase.initArg();
    const expectRes = testcase.initRes();

    const actualRes = testTarget(arg.a, arg.b);

    expect(actualRes).toBe(expectRes);
  }
}

class NumberTest extends TestCase<{ a: any; b: any }, number> {
  protected execute(testTargetGetter: () => (a: any, b: any) => number) {
    const testTarget = testTargetGetter();
    const arg = this.initArg();
    const expectRes = this.initRes();

    const actualRes = testTarget(arg.a, arg.b);

    expect(actualRes).toBe(expectRes);
  }

  public initArg(): { a: any; b: any } {
    return { a: 12, b: 2 };
  }

  public initRes(): number {
    return 10;
  }
}

class ObjectTest extends TestCase<{ a: any; b: any }, number> {
  public initArg(): { a: any; b: any } {
    return { a: { k: 12 }, b: { k: 2 } };
  }

  public initRes(): number {
    return -1;
  }
}

describe('SortUtil', () => {
  describe('compare Test', () => {
    new CompareTest(() => SortUtil.compare).run();
  });
});
