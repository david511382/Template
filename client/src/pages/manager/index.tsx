import React, { useEffect } from 'react';
import style from './index.module.css';
import Loader from '../../components/loader/Loader';
import MessageBox from '../../components/message-box/MessageBox';
import DataTable from '../../components/data-table/DataTable';
import { DenyLoginRequirement, Resp as DenyLoginRequirementResp } from '../../data/api/login-requirement/delete-login-requirement';
import { HttpResponse, Response } from '../../data/resp';
import { ERROR_MSG } from '../../data/msg';
import { AllowLoginRequirement, Resp as AllowLoginRequirementResp } from '../../data/api/login-requirement/allow-login-requirement';
import { FetchLoginRequirement, Resp as FetchLoginRequirementResp } from '../../data/api/login-requirement/fetch-login-requirement';
import { useRouter } from 'next/navigation';
import { async } from 'rxjs';

function Page() {
  const { push } = useRouter();
  type DataTableHandle = React.ElementRef<typeof DataTable>;
  const dataTableRef = React.useRef<DataTableHandle>(null);
  type LoaderHandle = React.ElementRef<typeof Loader>;
  const loaderRef = React.useRef<LoaderHandle>(null);
  type MessageBoxHandle = React.ElementRef<typeof MessageBox>;
  const mssageBoxRef = React.useRef<MessageBoxHandle>(null);

  function isNoAuth(code: number) {
    return code === 401 || code === 403;
  }
  function authRedirect<T>(res: Response<T>) {
    alert(res.msg);
    push('/manager/login');
  }
  const showMessage = (text: string) => {
    mssageBoxRef.current?.showMessage(text);
  }
  const showLoadingWrapper = async (f: () => Promise<void>) => {
    loaderRef.current?.show();
    await f();
    loaderRef.current?.hide();
  }
  function createRespHandler<T>(successHandler: (results: T) => void) {
    return (resp: HttpResponse<T>) => {
      if (resp.code === 200 && resp.res?.results) {
        successHandler(resp.res.results);
      } else if (isNoAuth(resp.code) && resp.res)
        authRedirect(resp.res);
      else if (resp.res?.msg) {
        showMessage(resp.res?.msg);
      } else {
        showMessage(ERROR_MSG);
      }
    }
  }
  const showData = (fetchDatas: FetchLoginRequirementResp[]) => {
    const contents = fetchDatas.map(fetchData => ({
      id: fetchData.id,
      infos: [
        fetchData.username,
        fetchData.ip,
        new Date(fetchData.request_time).toLocaleTimeString(),
        fetchData.description,
        new Date(fetchData.connect_time).toLocaleTimeString(),
        fetchData.code,
      ]
    }))
    dataTableRef.current?.setContents(contents);
  }
  const fetchLoginRequirements = async () => {
    const resp = await FetchLoginRequirement();
    const handler = createRespHandler((results: FetchLoginRequirementResp[]) => {
      showData(results);
    });
    handler(resp);
  }
  function createComfirmHandler<T>(msgF: (results: T) => string) {
    return createRespHandler((results: T) => {
      const msg = msgF(results);
      showMessage(msg);
      fetchLoginRequirements();
    });
  }
  const okHandler = (id: bigint) => {
    if (confirm("確定要核准連線嗎?")) {
      showLoadingWrapper(async () => {
        const resp = await AllowLoginRequirement(id);
        const handler = createComfirmHandler((results: AllowLoginRequirementResp) => {
          const username = results.username;
          const endTime = new Date(results.end_time);
          return `許可 ${username} 連線至${endTime.toLocaleString()}`;
        });
        handler(resp);
      })
    } else {
      showMessage("取消操作");
    }
  }
  const denyHandler = (id: bigint) => {
    if (confirm("確定要拒絕連線嗎?")) {
      showLoadingWrapper(async () => {
        const resp = await DenyLoginRequirement(id);
        const handler = createComfirmHandler((results: DenyLoginRequirementResp) => {
          const username = results.username;
          return `拒絕 ${username} 連線請求`;
        });
        handler(resp);
      });
    } else {
      showMessage("取消操作");
    }
  }

  useEffect(() => {
    fetchLoginRequirements();

    const timeoutID = setInterval(fetchLoginRequirements, 7000);
    return (() => {
      clearInterval(timeoutID);
    });
  }, []);

  return (
    <div className={style.page}>
      <MessageBox ref={mssageBoxRef} />
      <h1 className={style.h1}>連線登記列表</h1>
      <DataTable
        ref={dataTableRef}
        ths={[
          '廠商帳號',
          'IP',
          '申請時間',
          '登入原因說明',
          '請求連線時間',
          '承辦代號',
          '操作',
        ]}
        okHandler={okHandler}
        denyHandler={denyHandler}
      ></DataTable>
      <Loader
        ref={loaderRef}
        text='執行中'
      />
    </div >
  );
}
export default Page;