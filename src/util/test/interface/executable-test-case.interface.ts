export interface IExecutableTestcase<Target> {
  execute(testTargetGetter: () => Target);
}
