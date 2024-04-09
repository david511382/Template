export interface IAdditionalCheckTestcaseWithEnv<Target, Env> {
  additionalCheck(testTargetGetter: () => Target, testEnvGetter: () => Env);
}
