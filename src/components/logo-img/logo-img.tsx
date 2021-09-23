import React, { ReactElement } from 'react';

import styles from './logo-img.module.css';

function LogoImg(): ReactElement {
    return (
        <img className={styles.logoImg} src={`${process.env.PUBLIC_URL}/logo192.png`} data-cy="LogoImage" />
    );
}

export default LogoImg;