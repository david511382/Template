import React, { forwardRef, useImperativeHandle } from 'react';
import style from './DataTable.module.css';
import denyImg from '../../../public/static/img/deny.png';
import okImg from '../../../public/static/img/ok.png';

interface ContentData {
  id: bigint
  infos: string[]
}

type Handle = {
  setContents: (datas: ContentData[]) => void,
  clear: () => void,
};

interface Props {
  ths: string[]
  okHandler: (id: bigint) => void,
  denyHandler: (id: bigint) => void,
}

const DataTable = forwardRef<Handle, Props>((props: Props, ref) => {

  const [contents, setContents] = React.useState<ContentData[]>([]);

  useImperativeHandle(ref, () => ({
    setContents(contentDatas: ContentData[]) {
      setContents(contentDatas);
    },
    clear() {
      setContents([]);
    }
  }));

  const renderHead = () => {
    return props.ths.map((th, i) => (<th key={`th-${i}`} className={style.th}>{th}</th>));
  }
  const renderContent = () => {
    return contents.map(content => (
      <tr>
        {content.infos.map(info => <td className={style.td}>{info}</td>)}
        <td className={style.td}>
          <div>
            <input className={style.input}
              style={{ background: `center / contain no-repeat url(${okImg.src})` }}
              type='button'
              onClick={() => props.okHandler(content.id)}
            />
            <input className={style.input}
              style={{ background: `center / contain no-repeat url(${denyImg.src})` }}
              type='button'
              onClick={() => props.denyHandler(content.id)} />
          </div>
        </td>
      </tr>
    ));
  }

  return (
    <div className={style.component}>
      <table className={style.table} cellPadding={0} cellSpacing={0} border={0}>
        <tbody className={style.tbody}>
          <tr className={style.tblHeader}>
            {renderHead()}
          </tr>
          {renderContent()}
        </tbody>
      </table>
    </div>
  );
});
export default DataTable;
