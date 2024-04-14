import React,{  useEffect, useRef } from 'react';
import style from './ExtendableTextarea.module.css';

interface Props extends Focusable{
  placeholder?: string
  value?: string
}

function ExtendableTextarea(props: Props) {
  const DEFAULT_HEIGHT=`1.4em`;

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const [placeholder] = React.useState(props.placeholder);
  const [text,setText] = React.useState(props.value??'');
  const [height,setHeight] = React.useState<string|number>(DEFAULT_HEIGHT);
  const [width,setWidth] = React.useState(0);

  const onFocus = () => {
    props.onFocus && props.onFocus()
  }
  const onBlur = () => {
    props.onBlur && props.onBlur()
  }
  const onChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    const text = target.value;
    setText(text);
  }
  const onKeypress = (e:React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.which == 13) e.preventDefault();
  }

  useEffect(() => {
    if (textareaRef.current){
      const widthWithPadding = textareaRef.current.clientWidth;
      const computedStyle = getComputedStyle(textareaRef.current);
       const width =widthWithPadding- parseFloat(computedStyle.paddingLeft) - parseFloat(computedStyle.paddingRight);;
       setWidth(width);
      }
      
      if (spanRef.current){
        const resizeObserver = new ResizeObserver(() => {
          if (!spanRef.current)return;

          const heightWithPadding = spanRef.current.clientHeight;
          const computedStyle = getComputedStyle(spanRef.current);
           const spanHeight =heightWithPadding- parseFloat(computedStyle.paddingBottom) - parseFloat(computedStyle.paddingTop);;
           console.log(spanHeight);
           const newHeight =text ? spanHeight : DEFAULT_HEIGHT ;
           console.log(newHeight);
        if (newHeight.toString()===height.toString()) return;
        setHeight(newHeight);
      });
      resizeObserver.observe(spanRef.current);
      return () => resizeObserver.disconnect(); // clean up 
    }
  }, [
    textareaRef.current,
    spanRef.current,
    setWidth,
    height,
    setHeight,
    text]);

  return (
    <div className={style.component}>
      <textarea className={`${style.textarea} ${style.item}`}
      ref={textareaRef}
      style={{
        height:height,
      }}
      placeholder={placeholder}
      onChange={onChange}
      onKeyDown={onKeypress}
      onFocus={onFocus}
      onBlur={onBlur}
      ></textarea>
      <span className={`${style.span} ${style.item}`}
      ref={spanRef}
        style={ {
          width:width,
          display:'inline-block',
          wordBreak :'break-all',
          visibility :'hidden',
        }}>{text}</span>
    </div>
  );
}
export default ExtendableTextarea;
