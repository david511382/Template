import React from 'react';
import style from './index.module.css';
import Login from '../../../components/login/Login';
import { useRouter } from 'next/router';
import { setCookie } from 'cookies-next';
import bgImg from '../../../../public/static/img/bg.jpg';
import Image from 'next/image';

function Page() {
  const { push } = useRouter();

  const onLogin = (token: string) => {
    // Set a cookie
    setCookie('Authorization', token);

    push('/manager');
  };

  return (
    <div className={style.page}>
      <h1 className={style.h1}>司法院VPN連線登記系統管理後台</h1>
      <Login
        name="管理員登入"
        pswHint="請輸入AD密碼"
        submitBtnText="登入"
        hideCompany={true}
        onLogin={onLogin}
      />
      <Image
        src={bgImg.src}
        style={{
          zIndex: -1,
        }}
        alt="background image center / contain no-repeat"
        fill={true}
      />
    </div>
  );
}
export default Page;
