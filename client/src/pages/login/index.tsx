import React from 'react';
import style from './index.module.css';
import Login from '../../components/login/Login';

function Page() {
  return (
    <div className={style.page}>
      <h1 className={style.h1}>司法院VPN連線登記系統</h1>
      <Login
        name='廠商VPN連線登記'
        pswHint='請輸入IDE密碼'
        submitBtnText='線上登記'
      />
    </div>
  );
}
export default Page;
