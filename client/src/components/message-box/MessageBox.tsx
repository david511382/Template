import React, { forwardRef, useImperativeHandle } from 'react';
import styles from './Message-box.module.css'

type Handle = {
  showMessage: (msg: string) => void,
  hide: () => void,
};

interface Props {
}

const MessageBox = forwardRef<Handle, Props>((props: Props, ref) => {
  const [show, setShow] = React.useState(false);
  const [text, setText] = React.useState('');

  useImperativeHandle(ref, () => ({
    showMessage(text: string) {
      setShow(true);
      setText(text);
    },
    hide() {
      setShow(false);
    },
  }));

  return (
    <div
      className={`${styles.component} ${styles.info}`}
      hidden={!show}>
      <span
        className={styles.closebtn}
        onClick={() => { setShow(false) }}
      >&times;</span>
      <section>{text}</section>
    </div>
  );
});
export default MessageBox;
