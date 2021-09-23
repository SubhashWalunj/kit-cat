import { ArrowLeftOutlined } from '@ant-design/icons';
import React, { ReactElement } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './back-to-home.module.css';

function BackToHome(): ReactElement {
    return (
        <div className={styles.backToHomeContainer}>
            <NavLink to='/'><ArrowLeftOutlined />  <span>Back to home</span></NavLink>
        </div>
    );
}

export default BackToHome;