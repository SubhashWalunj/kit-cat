import React, { ReactElement } from 'react';

import { Button } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import LogoImg from '../logo-img/logo-img';

import styles from './navbar.module.css';
import Title from 'antd/lib/typography/Title';
import { NavLink } from 'react-router-dom';

function Navbar(): ReactElement {
    return (
        <Header className={styles.kitCatHeader}>
            <div className={styles.kitCatLogo}>
                <NavLink to="/"><LogoImg /></NavLink>
            </div>
            <div className={styles.kitCatTitleContainer}>
                <NavLink to="/"><Title className={styles.kitCatTitle} level={2} data-cy="AppTitle">Kit-Cat</Title></NavLink>
            </div>
            <div><NavLink to='/upload'><Button className="app-primary-btn">Add new cat</Button></NavLink></div>
        </Header>
    );
}

export default Navbar;