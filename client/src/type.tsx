type Func = () => void;

export interface Focusable {
  onFocus?: Func;
  onBlur?: Func;
}
