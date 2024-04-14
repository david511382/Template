import React from 'react';
import styles from './Message-box.module.css'

interface Props {
  text: string
  show: boolean
}

function MessageBox(props: Props) {
  const [show, setShow] = React.useState(props.show);
  const [text] = React.useState(props.text);

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
}
export default MessageBox;
