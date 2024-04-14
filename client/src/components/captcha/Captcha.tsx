import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import style from './Captcha.module.css';
import LabelInput from '../label-input/LabelInput';
import { GetCaptcha } from '../../data/api/captcha/captcha';

type Resp={
  text: string
  id: string
}

type Handle = {
  getValue:()=>Resp
  clear:()=>void
  reflash:()=>Promise<void>
};

interface Props{
  html:string
  errHandler?:(msg:string)=>void
}

const Captcha=forwardRef<Handle,Props>((props:Props,ref) =>{
  const captchaIdRef = useRef('');
   type InputHandle = React.ElementRef<typeof LabelInput>;
   const inputRef = React.useRef<InputHandle>(null);

  const getCaptcha = async () => {
    const resp = await GetCaptcha()
    if (!resp.res?.results)return;
    props.html = resp.res.results.html
    captchaIdRef.current= resp.res.results.id;
}

  useEffect(()=>{
    getCaptcha();
  },[getCaptcha]);

  useImperativeHandle(ref, () => ({
    getValue():Resp{
      const text = (inputRef&&inputRef.current)?inputRef.current.getValue():'';
      const id =  (captchaIdRef&&captchaIdRef.current)?captchaIdRef.current:'';
      return {text,id}
    },
    clear(){
      inputRef.current?.clear();
    },
   async reflash():Promise<void>{
     await getCaptcha();
    },
  }));

  return (
    <div className={style.component}>
                <div>
                  <LabelInput
                  ref={inputRef}
                    labelText='請輸入驗證碼'
                    placeholder='驗證碼'
                  />
                </div>
                <div className={style.captchaSvg}>{props.html}</div>
              </div>
  );
});
export default Captcha;
