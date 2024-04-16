import React, { JSXElementConstructor, forwardRef, useImperativeHandle, useRef } from 'react';
import style from './LabelInput.module.css';
import ExtendableTextarea from '../extendable-textarea/ExtendableTextarea';

type Handle = {
  getValue: () => string,
  clear: () => void,
};

interface InputProps extends Focusable {
  placeholder?: string
  value?: string
};

interface Props {
  autoHideLabel?: boolean
  labelText?: string
  type?: string
  placeholder?: string
  input?: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<InputProps>> | typeof ExtendableTextarea
}

const LabelInput = forwardRef<Handle, Props>((props: Props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  type ExtendableTextareaHandle = React.ElementRef<typeof ExtendableTextarea>;
  const customInputRef = React.useRef<ExtendableTextareaHandle & InputProps>(null);
  const autoHideLabel = (props.autoHideLabel === undefined) ? true : props.autoHideLabel;
  const labelText = props.labelText;
  const type = props.type;
  const placeholder = props.placeholder;
  const Input = props.input;

  const [hideLabel, setHideLabel] = React.useState(autoHideLabel);

  const labelOpacityCss = () => {
    return (hideLabel) ? 0 : 1
  }
  const inputOnFocus = () => {
    if (autoHideLabel)
      setHideLabel(false);
  }
  const inputOnBlur = () => {
    if (autoHideLabel)
      setHideLabel(true);
  }

  useImperativeHandle(ref, () => ({
    getValue() {
      return ((Input) ?
        customInputRef.current?.getValue() :
        inputRef.current?.value) ?? '';
    },
    clear() {
      if (customInputRef.current?.value) customInputRef.current.clear();
      if (inputRef.current?.value) inputRef.current.value = '';
    }
  }));

  return (
    <div className={style.component}>
      {labelText && <label
        className={style.label}
        style={{ opacity: labelOpacityCss() }} >{labelText}</label>}
      {
        !Input &&
        <input
          className={style.input}
          ref={inputRef}
          type={type}
          placeholder={placeholder}
          onBlur={inputOnBlur}
          onFocus={inputOnFocus} />}
      {
        Input && <Input
          ref={customInputRef}
          placeholder={placeholder}
          onBlur={inputOnBlur}
          onFocus={inputOnFocus} />}
    </div>
  );
});
export default LabelInput;
