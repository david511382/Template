import React, {
  ForwardedRef,
  InputHTMLAttributes,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import style from './DataTable.module.css';
import denyImg from '../../../public/static/img/deny.png';
import okImg from '../../../public/static/img/ok.png';

interface ContentData {
  id: bigint;
  infos: string[];
}

type Handle = {
  setContents: (datas: ContentData[]) => void;
  clear: () => void;
};

interface Props {
  ths: string[];
  okHandler: (id: bigint) => void;
  denyHandler: (id: bigint) => void;
}

function DataTable(props: Props, ref: ForwardedRef<Handle>) {
  const [contents, setContents] = React.useState<ContentData[]>([]);
  const tableRef = useRef<HTMLTableElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onInputEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!tableRef.current || !inputRef.current) return;

    const input = e.target;
    const table = tableRef.current.tBodies;
    for (let i = 1; i < table.length; i++) {
      const row = table.item(i) as HTMLTableSectionElement;
      filter(input, row);
    }
  };
  const filter = (input: HTMLInputElement, row: HTMLTableSectionElement) => {
    const text = row.textContent?.toLowerCase();
    const val = input.value.toLowerCase();
    row.style.display = text?.indexOf(val) === -1 ? 'none' : 'table-row';
  };

  useImperativeHandle(ref, () => ({
    setContents(contentDatas: ContentData[]) {
      setContents(contentDatas);
    },
    clear() {
      setContents([]);
    },
  }));

  const renderHead = () => {
    return props.ths.map((th) => (
      <th key={th} className={style.th}>
        {th}
      </th>
    ));
  };
  const renderContent = () => {
    return contents.map((content) => (
      <tr key={content.id}>
        {content.infos.map((info) => (
          <td key={info} className={style.td}>
            {info}
          </td>
        ))}
        <td key={content.id} className={style.td}>
          <div>
            <input
              className={style.input}
              style={{
                background: `center / contain no-repeat url(${okImg.src})`,
              }}
              type="button"
              onClick={() => props.okHandler(content.id)}
            />
            <input
              className={style.input}
              style={{
                background: `center / contain no-repeat url(${denyImg.src})`,
              }}
              type="button"
              onClick={() => props.denyHandler(content.id)}
            />
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <div className={style.component}>
      <input
        className={style.tableFilter}
        ref={inputRef}
        type="text"
        data-table={style.table}
        onInput={onInputEvent}
        placeholder="請輸入篩選條件"
      />
      <table
        className={style.table}
        cellPadding={0}
        cellSpacing={0}
        border={0}
        ref={tableRef}
      >
        <tbody className={style.tbody}>
          <tr className={style.tblHeader}>{renderHead()}</tr>
          {renderContent()}
        </tbody>
      </table>
    </div>
  );
}
export default forwardRef<Handle, Props>(DataTable);
