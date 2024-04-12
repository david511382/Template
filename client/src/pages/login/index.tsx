import React from 'react';
import Loader from '../../components/loader/Loader';
import MessageBox from '../../components/message-box/MessageBox';
import style from './index.module.css';
import LabelInput from '../../components/label-input/LabelInput';
import ExtendableTextarea from '../../components/extendable-textarea/ExtendableTextarea';

function Page() {

  // React.useEffect(() => {
  //   fetch("/api")
  //     .then((res) => res.json())
  //     .then((data) => setData(data.message));
  // }, []);

  return (
    <div className={style.page}>
      <h1 className={style.h1}></h1>
      <section className={style.container}>
        <div className={style.span6}>
          <div className={style.login}>
            <h1 className={style.h1}></h1>
            <div className={style.loginContent}>
              <LabelInput
                labelText='請輸入VPN帳號'
                placeholder='帳號'
              />
              <LabelInput
                labelText=''
                type='password'
                placeholder='密碼'
              />
              <LabelInput
                labelText='請輸入OTP'
                placeholder='OTP'
              />
              <LabelInput
                labelText='請輸入登入原因說明'
                placeholder='OTP'
              >
                <ExtendableTextarea></ExtendableTextarea>
                {/* <textarea className={style.textarea} id="description" placeholder="登入原因說明"></textarea> */}
              </LabelInput>
              <LabelInput
                placeholder='承辦代號'
              />
              <LabelInput
                autoHideLabel={false}
                labelText='當天開始連線時間，預設為登記當下時間'
                type='time'
                placeholder='承辦代號'
              />
              <div className="captcha-container">
                <div>
                  <LabelInput
                    labelText='請輸入驗證碼'
                    placeholder='驗證碼'
                  />
                </div>
                <div className={style.captchaSvg}></div>
              </div>
              <input className={style.input} id='loginBtn' type="submit" value="" />
            </div>
          </div>
        </div>
      </section>
      <Loader
        text='連線中'
        show={false}
      />
      <MessageBox
        text='sera'
        show={true}
      />
    </div>
  );
}
export default Page;
