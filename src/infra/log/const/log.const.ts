export const MSG_ALIAS = 'message';

const notMetaMap = new Map<string, boolean>([
  ['stack', true],
  [MSG_ALIAS, true],
  ['params', true],
]);

export function notMeta(s: string): boolean {
  return notMetaMap.get(s);
}
