export interface IAdditionalCheckTestcase<Target> {
  additionalCheck(testTargetGetter: () => Target);
}
