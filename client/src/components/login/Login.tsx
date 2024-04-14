import React from 'react';
import Loader from '../loader/Loader';
import MessageBox from '../message-box/MessageBox';
import style from './Login.module.css';
import LabelInput from '../label-input/LabelInput';
import ExtendableTextarea from '../extendable-textarea/ExtendableTextarea';
import Captcha from '../captcha/Captcha';
import { Login as LoginApi } from '../../data/api/login/login';

interface Props{
  name: string
  pswHint: string
  submitBtnText: string
  hideCompany?: boolean
}

function Login(props:Props) {
  const hideCompany = (props.hideCompany===undefined)?false:props.hideCompany;
  type LabelInputHandle = React.ElementRef<typeof LabelInput>;
  const accountRef = React.useRef<LabelInputHandle>(null);
  const pswRef = React.useRef<LabelInputHandle>(null);
  const otpRef = React.useRef<LabelInputHandle>(null);
  const despRef = React.useRef<LabelInputHandle>(null);
  const codeRef = React.useRef<LabelInputHandle>(null);
  const connectTimeRef = React.useRef<LabelInputHandle>(null);
  type CaptchaHandle = React.ElementRef<typeof Captcha>;
  const captchaRef = React.useRef<CaptchaHandle>(null);

  const [messageBox, setMessageBox] = React.useState({show:false,text:''});
  const [isShowLoading, setIsShowLoading] = React.useState(false);

  const clearMessage = ()=>{
    setMessageBox({show:false,text:''});
  }
  const showMessage = (text:string)=>{
    setMessageBox({show:true,text});
  }
  const showLoading = ()=>{
    setIsShowLoading(true);
  }
  const getCaptchaHeader = ()=>{
    const captchaData = (captchaRef&&captchaRef.current)?captchaRef.current.getValue():undefined;
    return {captcha:  `${captchaData?.id}:${captchaData?.text}`,};
  }
  const clearInput = ()=>{
    accountRef.current?.clear();
    pswRef.current?.clear();
    otpRef.current?.clear();
    despRef.current?.clear();
    connectTimeRef.current?.clear();
    captchaRef.current?.clear();
    codeRef.current?.clear();
  }
  const login =async (header:Record<string,string>)=>{
    let connectTime= new Date();
    if (connectTimeRef&&connectTimeRef.current){
      const connectTimeStr = connectTimeRef.current.getValue();
      const [hour, min] = connectTimeStr.split(':');
        connectTime.setHours(parseInt(hour));
        connectTime.setMinutes(parseInt(min));
    }
    const data = {
      username:accountRef?.current?.getValue()??undefined,
      description:despRef?.current?.getValue()??undefined,
      psw:pswRef?.current?.getValue()??undefined,
      otp:otpRef?.current?.getValue()??undefined,
      code:codeRef?.current?.getValue()??undefined,
      connect_time: connectTime.toISOString(),
  };
  alert(data);
  return;
  const resp= await LoginApi(data);
if (resp.code === 200){
  clearInput();
  
      const connectTime = resp.res?.results;
      const msg = `VPN連線登記完成，請求${connectTime?.toLocaleTimeString()}開始連線，待承辦人核可。`;
      showMessage(msg);
}else{
  captchaRef.current?.reflash();
  if (resp.res?.msg)
  showMessage(resp.res?.msg);
}
  }

    const onClick =async ()=>{
    clearMessage();
    showLoading();
    const captchaHeader = getCaptchaHeader();
    await login(captchaHeader);
  }

  return (
    <div className={style.component}>
      <section className={style.container}>
        <div className={style.span6}>
          <div className={style.login}>
            <h1 className={style.h1}>{props.name}</h1>
            <div className={style.loginContent}>
              <LabelInput
              ref={accountRef}
              labelText='請輸入VPN帳號'
              placeholder='帳號'
              />
              <LabelInput
              ref={pswRef}
              labelText={props.pswHint}
              type='password'
              placeholder='密碼'
              />
              {!hideCompany && <LabelInput
              ref={otpRef}
              labelText='請輸入OTP'
              placeholder='OTP'
              />}
              {!hideCompany && <LabelInput
              ref={despRef}
              labelText='請輸入登入原因說明'
              placeholder='登入原因說明'
              input={ExtendableTextarea}
              />}
              {!hideCompany && <LabelInput
              ref={codeRef}
              placeholder='承辦代號'
              />}
              {!hideCompany && <LabelInput
              ref={connectTimeRef}
                autoHideLabel={false}
                labelText='當天開始連線時間，預設為登記當下時間'
                type='time'
                placeholder='承辦代號'
              />}
              <Captcha 
              ref={captchaRef}
              html=''
              errHandler={(msg:string)=>{
                //showMessage(res.msg);
              }}/>
              <input className={style.input}
               type="submit"
               onClick={onClick}
                value={props.submitBtnText} />
            </div>
          </div>
        </div>
      </section>
      <Loader
        text='連線中'
        show={isShowLoading}
      />
      <MessageBox {...messageBox}/>
    </div>
  );
}
export default Login;
