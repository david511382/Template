import React from 'react';
import style from './ExtendableTextarea.module.css';

type Func = () => void;

interface Props {
  onFocus?: Func
  onBlur?: Func
}

function ExtendableTextarea(props: Props) {
  const onFocus = () => {
    props.onFocus && props.onFocus()
  }
  const onBlur = () => {
    props.onBlur && props.onBlur()
  }

  return (
    <div className={style.index}>
      <textarea className={style.textarea}
        placeholder="登入原因說明"
        onFocus={onFocus}
        onBlur={onBlur}></textarea>
    </div>
  );
}
export default ExtendableTextarea;
