export type TestCaseClass<Arg, Res> = new () => TestCase<Arg, Res>;

export abstract class TestCase<Arg, Res> {
  abstract initArg(): Arg;

  abstract initRes(): Res;
}
