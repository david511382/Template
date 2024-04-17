import React, { forwardRef, useImperativeHandle } from 'react';
import style from './DataTable.module.css';

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
    return props.ths.map(th => (<th className={style.th}>{th}</th>));
  }
  const renderContent = () => {
    return contents.map(content => (
      <tr>
        {content.infos.map(info => <td className={style.td}>{info}</td>)}
        <td className={style.td}>
          <div>
            <input className={style.okBtn}
              type='button'
              onClick={() => props.okHandler(content.id)}
            />
            <input className={style.denyBtn}
              type='button'
              onClick={() => props.okHandler(content.id)} />
          </div>
        </td>
      </tr>
    ));
  }

  return (
    <div className={style.component}>
      <div className={style.tblHeader}>
        <table className={style.table} cellPadding={0} cellSpacing={0} border={0}>
          <thead>
            <tr>
              {renderHead()}
            </tr>
          </thead>
        </table>
      </div>
      <div className={style.tblContent}>
        <table cellPadding={0} cellSpacing={0} border={0}>
          <tbody>
            {renderContent()}
          </tbody>
        </table>
      </div>
    </div>
  );
});
export default DataTable;
