import React from 'react';
import style from './LabelInput.module.css';
import { Redirect, Route, RouteComponentProps, RouteProps, Switch } from "react-router-dom";

type PartialUser = {
  id: number;
  username: string;
  email: string;
};

declare function useMeQuery(): { error: any; loading: boolean; data?: { me: PartialUser } }

type Func = () => void;

//RouteComponentProps
type ComponentProps = RouteComponentProps & {
  onFocus?: Func
  onBlur?: Func
}

type ChildrenElement = JSX.Element | (JSX.Element | undefined)[];

interface Props {
  autoHideLabel?: boolean
  labelText?: string
  type?: string
  placeholder?: string
  children?: React.<ComponentProps>;
  // children?: ChildrenElement
  // children?: never;
}

function LabelInput(props: Props) {
  const Component = props.children;
  const [labelText] = React.useState(props.labelText);
  const [type] = React.useState(props.type);
  const [placeholder] = React.useState(props.placeholder);
  const [hideLabel, setHideLabel] = React.useState((props.autoHideLabel === undefined) ? true : props.autoHideLabel);

  const labelOpacityCss = () => {
    return (hideLabel) ? 0 : 1
  }
  const inputOnFocus = () => {
    if (!props.autoHideLabel)
      setHideLabel(false);
  }
  const inputOnBlur = () => {
    if (!props.autoHideLabel)
      setHideLabel(true);
  }

  return (
    <div className={style.index}>
      {labelText && <label
        className={style.label}
        style={{ opacity: labelOpacityCss() }} >{labelText}</label>}
      {
        // !Component &&
        <input
          className={style.input}
          type={type}
          placeholder={placeholder}
          onBlur={inputOnBlur}
          onFocus={inputOnFocus} />}
      {
        Component &&
        <Component onBlur={inputOnBlur}
          onFocus={inputOnFocus} />
      }

    </div>
  );
}
export default LabelInput;
