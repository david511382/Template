type Func = () => void;

interface Focusable  {
  onFocus?: Func
  onBlur?: Func
}
