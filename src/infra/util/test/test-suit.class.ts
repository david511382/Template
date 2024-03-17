import { IExecutableTestcase } from './interface/executable-test-case.interface';
import { IAdditionalCheckTestcase } from './interface/additional-check-test-case.interface';
import { TestCaseClass, TestCase } from './test-case.class';

export abstract class TestSuit<Target, Arg, Res> {
  protected abstract readonly testcasesClasses: TestCaseClass<Arg, Res>[];
  private readonly testcases: TestCase<Arg, Res>[] = [];

  constructor(private readonly testTargetGetter: () => Target) {}

  async run() {
    this.loadTestcases();

    this.testcases.forEach((testcase) => {
      it(testcase.constructor.name, async () => {
        await this.beforeExecute(testcase);

        if (this.isExecutor(testcase)) {
          await testcase.execute(this.testTargetGetter);
        } else {
          await this.execute(testcase, this.testTargetGetter);

          if (this.isAdditionalChecker(testcase)) {
            await this.additionalCheck(testcase, this.testTargetGetter);
          }
        }
      });
    });
  }

  abstract execute(
    testcase: TestCase<Arg, Res>,
    testTargetGetter: () => Target,
  );

  protected isExecutor(
    testcase: IExecutableTestcase<Target> | any,
  ): testcase is IExecutableTestcase<Target> {
    return 'execute' in testcase;
  }

  protected isAdditionalChecker(
    testcase: IAdditionalCheckTestcase<Target> | any,
  ): testcase is IAdditionalCheckTestcase<Target> {
    return 'additionalCheck' in testcase;
  }

  protected async additionalCheck(
    testcase: IAdditionalCheckTestcase<Target>,
    testTargetGetter: () => Target,
  ) {
    await testcase.additionalCheck(testTargetGetter);
  }

  protected beforeExecute(testcase: TestCase<Arg, Res>) {}

  private loadTestcases() {
    this.testcasesClasses.forEach((t) => {
      this.testcases.push(new t());
    });
  }
}
