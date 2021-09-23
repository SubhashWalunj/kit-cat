import React, { ReactElement } from "react";

import { Button, Radio } from "antd";

import styles from './pagination.module.css';

function Pagination(props: { page: number, gotoPage: (page: number) => void }): ReactElement {
    const gotTo1stPageLink = props.page ? <Button type="link" onClick={() => props.gotoPage(0)} style={{ padding: '0' }}>Go to 1<sup>st</sup>&nbsp;page</Button> : null;
    return (
        <div className={styles.paginationContainer} data-cy="PaginationContainer">
            <Radio.Group style={{ margin: '10px 0' }}>
                <Radio.Button disabled={props.page === 0} onClick={() => props.gotoPage(props.page - 1)}>Previous</Radio.Button>
                <Radio.Button onClick={() => props.gotoPage(props.page + 1)}>Next</Radio.Button>
            </Radio.Group>
            <br />
            <i>Showing page {props.page + 1}</i>
            <br />
            {gotTo1stPageLink}
        </div>
    );
}

export default Pagination