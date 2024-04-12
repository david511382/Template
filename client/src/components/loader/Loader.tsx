import React from 'react';
import styles from './loader.module.css'

interface Props {
    text: string
    show: boolean
}

function Loader(props: Props) {
    const [show] = React.useState(props.show);
    const [text] = React.useState(props.text);

    const userSelectCss = (): 'none' | undefined => {
        return (show) ? 'none' : undefined;
    }

    return (
        <div className={styles.loaderContainer}
            hidden={!show}
            style={{ userSelect: userSelectCss() }} >
            <p className={styles.loadingText}>{text}</p>
        </div >
    );
}
export default Loader;
