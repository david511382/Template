type EnumValue = string | number | symbol;
type Enum = { [key: EnumValue]: EnumValue };

export function getEnumKeyByValue<T extends Enum>(
  myEnum: T,
  enumValue: EnumValue,
): keyof T | undefined {
  const keys = Object.keys(myEnum).filter((x) => myEnum[x] == enumValue);
  return keys.length > 0 ? keys[0] : undefined;
}
type Func = () => void;

interface Focusable {
  onFocus?: Func;
  onBlur?: Func;
}
