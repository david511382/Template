import React from 'react';
import style from './index.module.css';
import Login from '../../components/login/Login';

function Page() {
  type LoginHandle = React.ElementRef<typeof Login>;
  const loginRef = React.useRef<LoginHandle>(null);

  const onLogin = (connectTimeStr: string) => {
    const connectTime = (connectTimeStr) ? new Date(connectTimeStr) : undefined;
    const msg = `VPN連線登記完成，請求${connectTime?.toLocaleTimeString()}開始連線，待承辦人核可。`;
    loginRef.current?.showMessage(msg);
    loginRef.current?.clearInput();
  }

  return (
    <div className={style.page}>
      <h1 className={style.h1}>司法院VPN連線登記系統</h1>
      <Login
        ref={loginRef}
        name='廠商VPN連線登記'
        pswHint='請輸入IDE密碼'
        submitBtnText='線上登記'
        onLogin={onLogin}
      />
    </div>
  );
}
export default Page;
