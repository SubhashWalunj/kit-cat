import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { Col, Row, Alert, Spin, Dropdown, Menu, message, Tag } from 'antd';
import { ICatInterface } from '../../interfaces/cat.interface';
import ENDPOINT_URL_CONSTANTS from '../../constants/endpoint-url.constants';
import { createFetchRequestArgs } from '../../factories/fetch.factories';
import { HTTP_METHODS } from '../../enums/http-methods.enum';

import styles from './cat-list.module.css';
import Cat from '../cat/cat';
import { IVoteInterface } from '../../interfaces/vote.interface';
import { IFavoriteInterface } from '../../interfaces/favorite.interface';
import { APP_CONSTANTS } from '../../constants/app.constants';
import Pagination from '../pagination/pagination';

function CatList(): ReactElement {
    const [cats, setCats] = useState<ICatInterface[]>([]);
    const [allCats, setAllCats] = useState<ICatInterface[]>([]);
    const [loading, setLoading] = useState(false);
    const [filterByFavorite, setFilterByFavorite] = useState(false);
    const [orderBy, setOrderBy] = useState('DESC');
    const [page, setPage] = useState(0);

    const usePrevious = <T extends unknown>(value: T): T | undefined => {
        const ref = useRef<T>();
        useEffect(() => {
            ref.current = value;
        });
        return ref.current;
    }

    const previousOrderByValue = usePrevious(orderBy);

    useEffect(() => {
        fetchCatList(true);
    }, [page]);

    useEffect(() => {
        if (page !== 0) {
            setPage(0);
        } else if (previousOrderByValue !== undefined) {
            // stop fetching at the beginning
            fetchCatList(true);
        }
    }, [orderBy]);

    const handleFilterMenuClick = (e: any) => {
        if (e.key === '2') {
            const filteredList = cats.filter(cat => cat.isFavourite);
            setAllCats([...cats]);
            setCats(filteredList);
            setFilterByFavorite(true);
        } else {
            setCats(allCats);
            setFilterByFavorite(false);
        }
    }

    const handleOrderByMenuClick = (e: any) => {
        if (e.key === '2') {
            setOrderBy('ASC');
        } else {
            setOrderBy('DESC');
        }
    }

    const filterMenu = (
        <Menu onClick={handleFilterMenuClick}>
            <Menu.Item key="1">Show all</Menu.Item>
            <Menu.Item key="2">Show favorites from the list</Menu.Item>
        </Menu>
    );

    const orderByMenu = (
        <Menu onClick={handleOrderByMenuClick}>
            <Menu.Item key="1">Default (Newest first)</Menu.Item>
            <Menu.Item key="2">Oldest first</Menu.Item>
        </Menu>
    );

    function bindVotesAndFavorites(
        catList: ICatInterface[],
        votes: IVoteInterface[],
        favorites: IFavoriteInterface[],

    ): ICatInterface[] {
        const catListCopy = [...catList];
        return catListCopy.map(cat => {
            const matchingVotes = votes.filter(vote => vote.image_id === cat.id);
            let votesCount = 0;
            matchingVotes.forEach(vote => {
                if (vote.value) {
                    votesCount += vote.value
                } else {
                    votesCount -= 1;
                }
            });
            const matchingFavorite = favorites.find(favorite => favorite.image_id === cat.id);
            cat.votes = votesCount;
            if (matchingFavorite) {
                cat.favoriteId = matchingFavorite.id;
                cat.isFavourite = true;
            }
            return cat;
        });
    }

    async function fetchCatList(showLoader = false) {
        try {
            setLoading(showLoader);
            const getCatListRequestArgs = createFetchRequestArgs(
                HTTP_METHODS.GET,
                `${process.env.REACT_APP_END_POINT_DOMAIN}${ENDPOINT_URL_CONSTANTS.CAT_LIST}?limit=${APP_CONSTANTS.PAGINATION_LIMIT}&page=${page}&order=${orderBy}`,
                { "content-type": 'application/json' }
            );
            const catListResult = await fetch(...getCatListRequestArgs);
            const catListJson: any = await catListResult.json();
            if (catListResult.ok) {
                const votes = await fetchVotes();
                const favorites = await fetchFavorites();
                const catList = bindVotesAndFavorites(catListJson, votes, favorites);
                setCats(catList);
                setAllCats(catList);
            } else {
                message.error(`There is an error occurred while fetching the list of cats. Please try again. ${catListJson.message}`);
            }
            setLoading(false);
        } catch (e: any) {
            message.error(`There is an error occurred while fetching the list of cats. Please try again. ${e.message || ''}`);
            setLoading(false);
        }
    }

    async function fetchVotes(): Promise<IVoteInterface[]> {
        try {
            const getVotesRequestArgs = createFetchRequestArgs(
                HTTP_METHODS.GET,
                `${process.env.REACT_APP_END_POINT_DOMAIN}${ENDPOINT_URL_CONSTANTS.CAT_VOTES}`,
                { "content-type": 'application/json' }
            );
            const votesResult = await fetch(...getVotesRequestArgs);
            const votesResultJson = await votesResult.json();
            if (votesResult.ok) {
                return votesResultJson;
            } else {
                message.error(`There is an error occurred while fetching the votes. Please try again. ${votesResultJson.message}`);
                setLoading(false);
            }
        } catch (e: any) {
            message.error(`There is an error occurred while fetching the votes. Please try again. ${e.message || ''}`);
            setLoading(false);
        }
        return [] as IVoteInterface[];
    }

    async function fetchFavorites(): Promise<IFavoriteInterface[]> {
        try {
            const getFavoriteRequestArgs = createFetchRequestArgs(
                HTTP_METHODS.GET,
                `${process.env.REACT_APP_END_POINT_DOMAIN}${ENDPOINT_URL_CONSTANTS.CAT_FAVOURITES}`,
                { "content-type": 'application/json' }
            );
            const favoriteResult = await fetch(...getFavoriteRequestArgs);
            const favoriteResultJson: any = await favoriteResult.json();
            if (favoriteResult.ok) {
                return favoriteResultJson;
            } else {
                message.error(`There is an error occurred while fetching the votes. Please try again. ${favoriteResultJson.message}`);
                setLoading(false);
            }
        } catch (e: any) {
            message.error(`There is an error occurred while fetching the votes. Please try again. ${e.message || ''}`);
            setLoading(false);
        }
        return [] as IFavoriteInterface[];
    }

    const voteHandler = async (targetCat: ICatInterface, value: number) => {
        const targetCatIndex = cats.findIndex(cat => cat.id === targetCat.id);
        const catsCopy = [...cats];
        catsCopy[targetCatIndex].disableVoting = true;
        setCats(catsCopy);

        const votePayload = {
            image_id: targetCat.id,
            value: value
        };
        try {
            const setCatVoteReq = createFetchRequestArgs(
                HTTP_METHODS.POST,
                `${process.env.REACT_APP_END_POINT_DOMAIN}${ENDPOINT_URL_CONSTANTS.CAT_VOTES}`,
                { "content-type": 'application/json' },
                JSON.stringify(votePayload)
            );
            const catVoteResult = await fetch(...setCatVoteReq);
            const catVoteRespJson: any = await catVoteResult.json();
            if (catVoteResult.ok) {
                message.success(`Your vote has been registered.`);
                fetchCatList();
            } else {
                message.error(`There is an error occurred while registering your vote. Please try again. ${catVoteRespJson.message}`);
            }
        } catch (err) {
            if (err instanceof Error) {
                message.error(`There is an error occurred while registering your vote. Please try again. ${err.message || ''}`);
            }
        }
    }

    const favoriteHandler = async (targetCat: ICatInterface) => {
        const targetCatIndex = cats.findIndex(cat => cat.id === targetCat.id);
        const catsCopy = [...cats];
        catsCopy[targetCatIndex].disableFavorite = true;
        setCats(catsCopy);

        const favoritePayload = {
            image_id: targetCat.id
        };
        const messageText = targetCat.isFavourite ? 'unfavorite' : 'favorite';
        try {
            let setCatFavoriteReq;

            if (targetCat.isFavourite) {
                setCatFavoriteReq = createFetchRequestArgs(
                    HTTP_METHODS.DELETE,
                    `${process.env.REACT_APP_END_POINT_DOMAIN}${ENDPOINT_URL_CONSTANTS.CAT_FAVOURITES}/${targetCat.favoriteId}`,
                    { "content-type": 'application/json' }
                );
            } else {
                setCatFavoriteReq = createFetchRequestArgs(
                    HTTP_METHODS.POST,
                    `${process.env.REACT_APP_END_POINT_DOMAIN}${ENDPOINT_URL_CONSTANTS.CAT_FAVOURITES}`,
                    { "content-type": 'application/json' },
                    JSON.stringify(favoritePayload)
                );
            }

            const catFavoriteResult = await fetch(...setCatFavoriteReq);
            const catVoteFavoriteJson: any = await catFavoriteResult.json();
            if (catFavoriteResult.ok) {
                message.success(`The cat is set as ${messageText}.`);
                fetchCatList();
            } else {
                message.error(`There is an error occurred while setting the cat as ${messageText}. Please try again. ${catVoteFavoriteJson.message}`);
            }
        } catch (err) {
            if (err instanceof Error) {
                message.error(`There is an error occurred while setting the cat as ${messageText}. Please try again. ${err.message || ''}`);
            }
        }
    }

    const deleteCatHandler = async (targetCat: ICatInterface) => {
        const targetCatIndex = cats.findIndex(cat => cat.id === targetCat.id);
        const catsCopy = [...cats];
        catsCopy[targetCatIndex].disableFavorite = true;
        catsCopy[targetCatIndex].disableVoting = true;
        catsCopy[targetCatIndex].disableDelete = true;
        setCats(catsCopy);

        const deleteEndpoint = ENDPOINT_URL_CONSTANTS.CAT_DELETE.replace('{image_id}', targetCat.id);
        try {
            const deleteCatReq = createFetchRequestArgs(
                HTTP_METHODS.DELETE,
                `${process.env.REACT_APP_END_POINT_DOMAIN}${deleteEndpoint}`,
                { "content-type": 'application/json' }
            );


            const catRemoveResult = await fetch(...deleteCatReq);
            if (catRemoveResult.ok) {
                message.success(`The cat is removed.`);
                fetchCatList();
            } else {
                message.error(`There is an error occurred while removing the cat.`);
            }
        } catch (err) {
            if (err instanceof Error) {
                message.error(`There is an error occurred while removing the cat. Please try again. ${err.message || ''}`);
            }
        }
    }

    const removeFilterByFavorite = () => {
        setCats(allCats);
        setFilterByFavorite(false);
    };

    const removeOrderByDesc = () => {
        setOrderBy('DESC');
    }

    const gotoPageHandler = (page: number) => {
        setPage(page);
    }

    let content = cats.map(cat => {
        return (
            <Col className="catme-cat-holder" xs={24} sm={12} md={8} lg={6} key={cat.id}>
                <Cat cat={cat} onVote={voteHandler} onFavorite={favoriteHandler} onDelete={deleteCatHandler}></Cat>
            </Col>
        );
    });

    if (!content.length) {
        content = [<Alert key="0" style={{ flex: 1, textAlign: 'center' }} message="No results found. Try adding new cat using 'Add new cat' button or adjust the filter." type="info" />];
    }

    if (loading) {
        content = [<Spin key="0" size="large" style={{ flex: 1 }} />];
    }

    const filterTags = [];
    if (filterByFavorite) {
        filterTags.push(<Tag key="filterByTag" closable onClose={removeFilterByFavorite} style={{ margin: '5px 0' }}>
            Show my favorites filter applied
        </Tag>);
    }

    if (orderBy === 'ASC') {
        filterTags.push(<Tag key="orderByTag" closable onClose={removeOrderByDesc} style={{ margin: '5px 0' }}>
            Ordered by Oldest first
        </Tag>);
    }

    let pagination = null;
    if (cats.length === APP_CONSTANTS.PAGINATION_LIMIT) {
        pagination = <Pagination page={page} gotoPage={gotoPageHandler} />;
    }

    return (
        <>
            <div className={styles.actionContainer}>
                <Dropdown.Button style={{ marginRight: '10px' }} overlay={filterMenu}>Filter By</Dropdown.Button>
                <Dropdown.Button overlay={orderByMenu}>Order By</Dropdown.Button>
            </div>
            {filterTags}
            <Row gutter={[10, 10]}>
                {content}
            </Row>
            {pagination}
        </>
    );
}

export default CatList;