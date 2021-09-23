import React, { CSSProperties, ReactElement, useState } from "react";

import { DeleteTwoTone, HeartFilled, HeartOutlined } from "@ant-design/icons";
import { Badge, Card, Radio, Image, Tooltip, Button, Popconfirm } from "antd";
import { APP_CONSTANTS } from "../../constants/app.constants";
import { ICatInterface } from "../../interfaces/cat.interface";

import styles from './cat.module.css';

const Cat = (
    props: {
        cat: ICatInterface,
        onVote: (cat: ICatInterface, vote: number) => void,
        onFavorite: (cat: ICatInterface) => void,
        onDelete: (cat: ICatInterface) => void
    }): ReactElement => {
    const favoriteIcon = props.cat.isFavourite ? <HeartFilled style={{ color: '#FC7E29' }} /> : <HeartOutlined />;
    const favoriteTooltip = props.cat.isFavourite ? 'Unfavorite' : 'Favorite';
    const [imgStyles, setImgStyles] = useState<CSSProperties>();
    return (
        <Card>
            <Badge.Ribbon
                text={`Votes: ${props.cat.votes || 0}`}
                color="#FC7E29"
            >
                <Image
                    className={styles.catImg}
                    width={'100%'}
                    src={props.cat.url || 'error'}
                    fallback={APP_CONSTANTS.IMG_PLACEHOLDER}
                    onLoad={() => setImgStyles({ visibility: 'visible', opacity: 1 })}
                    style={imgStyles}
                />
            </Badge.Ribbon>
            <div className={styles.kitCatImageActionsContainer}>
                <Tooltip title={favoriteTooltip}>
                    <Button
                        shape="circle"
                        icon={favoriteIcon}
                        disabled={props.cat.disableFavorite}
                        onClick={() => props.onFavorite(props.cat)} />
                </Tooltip>
                <Radio.Group size="middle" style={{ 'fontWeight': 'bold' }} disabled={props.cat.disableVoting === true}>
                    <Radio.Button value="+1" onClick={() => props.onVote(props.cat, 1)}>+1</Radio.Button>
                    <Radio.Button value="-1" onClick={() => props.onVote(props.cat, 0)}>-1</Radio.Button>
                </Radio.Group>
                <Tooltip title="Remove">
                    <Popconfirm
                        title="Are you sure to delete this cat?"
                        onConfirm={() => props.onDelete(props.cat)}
                        okText="Yes"
                        cancelText="No"
                        placement="bottom"
                    >
                        <Button
                            shape="circle"
                            icon={<DeleteTwoTone twoToneColor="red" />}
                            disabled={props.cat.disableDelete} />
                    </Popconfirm>
                </Tooltip>
            </div>
        </Card>
    );
};

export default Cat;