import React, { ForwardedRef, forwardRef, useImperativeHandle } from 'react';
import styles from './Loader.module.css';

type Handle = {
  show: () => void;
  hide: () => void;
};

interface Props {
  text: string;
}

function Loader(props: Props, ref: ForwardedRef<Handle>) {
  const [isShow, setIsShow] = React.useState(false);
  const [text] = React.useState(props.text);

  const userSelectCss = (): 'none' | undefined => {
    return isShow ? 'none' : undefined;
  };

  useImperativeHandle(ref, () => ({
    show() {
      setIsShow(true);
    },
    hide() {
      setIsShow(false);
    },
  }));

  return (
    <div
      className={styles.loaderContainer}
      hidden={!isShow}
      style={{ userSelect: userSelectCss() }}
    >
      <p className={styles.loadingText}>{text}</p>
    </div>
  );
}
export default forwardRef<Handle, Props>(Loader);
