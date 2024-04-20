import React, { ForwardedRef, forwardRef, useImperativeHandle } from 'react';
import Loader from '../loader/Loader';
import MessageBox from '../message-box/MessageBox';
import style from './Login.module.css';
import LabelInput from '../label-input/LabelInput';
import ExtendableTextarea from '../extendable-textarea/ExtendableTextarea';
import Captcha from '../captcha/Captcha';
import { ManagerLogin as ManagerLoginApi } from '../../data/api/login/manager-login';
import { CompanyLogin as CompanyLoginApi } from '../../data/api/login/company-login';
import { ERROR_MSG } from '../../data/msg';
import { HttpResponse } from '../../data/resp';

type Handle = {
  showMessage: (msg: string) => void;
  clearInput: () => void;
};

interface Props {
  name: string;
  pswHint: string;
  submitBtnText: string;
  hideCompany?: boolean;
  onLogin: (results: any) => void;
}

function Login(props: Props, ref: ForwardedRef<Handle>) {
  const hideCompany =
    props.hideCompany === undefined ? false : props.hideCompany;
  type LabelInputHandle = React.ElementRef<typeof LabelInput>;
  const accountRef = React.useRef<LabelInputHandle>(null);
  const pswRef = React.useRef<LabelInputHandle>(null);
  const otpRef = React.useRef<LabelInputHandle>(null);
  const despRef = React.useRef<LabelInputHandle>(null);
  const codeRef = React.useRef<LabelInputHandle>(null);
  const connectTimeRef = React.useRef<LabelInputHandle>(null);
  type CaptchaHandle = React.ElementRef<typeof Captcha>;
  const captchaRef = React.useRef<CaptchaHandle>(null);
  type LoaderHandle = React.ElementRef<typeof Loader>;
  const loaderRef = React.useRef<LoaderHandle>(null);
  type MessageBoxHandle = React.ElementRef<typeof MessageBox>;
  const mssageBoxRef = React.useRef<MessageBoxHandle>(null);

  const clearMessage = () => {
    mssageBoxRef.current?.hide();
  };
  const showMessage = (text: string) => {
    mssageBoxRef.current?.showMessage(text);
  };
  const showLoadingWrapper = async (f: () => Promise<void>) => {
    loaderRef.current?.show();
    await f();
    loaderRef.current?.hide();
  };
  const getCaptchaHeader = () => {
    const captchaData =
      captchaRef && captchaRef.current
        ? captchaRef.current.getValue()
        : undefined;
    return { captcha: `${captchaData?.id}:${captchaData?.text}` };
  };
  function createRespHandler<T>(successHandler: (results: T) => void) {
    return (resp: HttpResponse<T>) => {
      if (resp.code === 200 && resp.res?.results) {
        successHandler(resp.res.results);
      } else {
        captchaRef.current?.reflash();
        if (resp.res?.msg) showMessage(resp.res.msg);
        else showMessage(ERROR_MSG);
      }
    };
  }
  const companyLogin = async (header: Record<string, string>) => {
    const connectTime = new Date();
    const connectTimeStr = connectTimeRef?.current?.getValue();
    if (connectTimeStr) {
      const [hour, min] = connectTimeStr.split(':');
      connectTime.setHours(parseInt(hour));
      connectTime.setMinutes(parseInt(min));
    }
    const data = {
      username: accountRef?.current?.getValue() ?? undefined,
      description: despRef?.current?.getValue() ?? undefined,
      psw: pswRef?.current?.getValue() ?? undefined,
      otp: otpRef?.current?.getValue() ?? undefined,
      code: codeRef?.current?.getValue() ?? undefined,
      connect_time: connectTime.toISOString(),
    };
    const resp = await CompanyLoginApi(data, header);
    const handler = createRespHandler(props.onLogin);
    handler(resp);
  };
  const managerLogin = async (header: Record<string, string>) => {
    const data = {
      username: accountRef?.current?.getValue() ?? undefined,
      psw: pswRef?.current?.getValue() ?? undefined,
    };
    const resp = await ManagerLoginApi(data, header);
    const handler = createRespHandler(props.onLogin);
    handler(resp);
  };

  useImperativeHandle(ref, () => ({
    showMessage(msg: string) {
      showMessage(msg);
    },
    clearInput() {
      accountRef.current?.clear();
      pswRef.current?.clear();
      otpRef.current?.clear();
      despRef.current?.clear();
      connectTimeRef.current?.clear();
      captchaRef.current?.clear();
      codeRef.current?.clear();
    },
  }));

  const errHandler = React.useCallback((msg: string) => {
    showMessage(msg);
  }, []);
  const onClick = async () => {
    showLoadingWrapper(async () => {
      clearMessage();
      const captchaHeader = getCaptchaHeader();
      if (hideCompany) await managerLogin(captchaHeader);
      else await companyLogin(captchaHeader);
    });
  };

  return (
    <div className={style.component}>
      <section className={style.container}>
        <div className={style.span6}>
          <div className={style.login}>
            <h1 className={style.h1}>{props.name}</h1>
            <div className={style.loginContent}>
              <LabelInput
                ref={accountRef}
                labelText="請輸入VPN帳號"
                placeholder="帳號"
              />
              <LabelInput
                ref={pswRef}
                labelText={props.pswHint}
                type="password"
                placeholder="密碼"
              />
              {!hideCompany && (
                <LabelInput
                  ref={otpRef}
                  labelText="請輸入OTP"
                  placeholder="OTP"
                />
              )}
              {!hideCompany && (
                <LabelInput
                  ref={despRef}
                  labelText="請輸入登入原因說明"
                  placeholder="登入原因說明"
                  input={ExtendableTextarea}
                />
              )}
              {!hideCompany && (
                <LabelInput ref={codeRef} placeholder="承辦代號" />
              )}
              {!hideCompany && (
                <LabelInput
                  ref={connectTimeRef}
                  autoHideLabel={false}
                  labelText="當天開始連線時間，預設為登記當下時間"
                  type="time"
                  placeholder="承辦代號"
                />
              )}
              <Captcha ref={captchaRef} errHandler={errHandler} />
              <input
                className={style.input}
                type="submit"
                onClick={onClick}
                value={props.submitBtnText}
              />
            </div>
          </div>
        </div>
      </section>
      <Loader ref={loaderRef} text="連線中" />
      <MessageBox ref={mssageBoxRef} />
    </div>
  );
}
export default forwardRef<Handle, Props>(Login);
