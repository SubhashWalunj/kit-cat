import { rest } from 'msw';
import ENDPOINT_URL_CONSTANTS from '../constants/endpoint-url.constants';

export const handlers = [
    rest.get(`${process.env.REACT_APP_END_POINT_DOMAIN}${ENDPOINT_URL_CONSTANTS.CAT_LIST}`, (req, res, ctx) => {
        const mockedImages = [];
        for (let i = 0; i < 150; i++) {
            mockedImages.push(
                {
                    "breeds": [],
                    "id": `image-${i}`,
                    "width": 549,
                    "height": 549,
                    "sub_id": null,
                    "created_at": "2021-08-30T12:31:27.000Z",
                    "original_filename": `original-image-${i}.jpg`,
                    "breed_ids": null
                }
            );
        }

        const page = parseInt(req.url.searchParams.get('page')!);
        const limit = parseInt(req.url.searchParams.get('limit')!);

        return res(
            ctx.status(200),
            ctx.json(mockedImages.slice(page * limit, limit * (page + 1)))
        );
    }),
    rest.get(`https://api.thecatapi.com/v1/votes`, (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(
                [
                    {
                        "id": 322224,
                        "image_id": "image-1",
                        "sub_id": null,
                        "created_at": "2021-08-29T09:48:36.000Z",
                        "value": 1,
                        "country_code": "GB"
                    },
                    {
                        "id": 322332,
                        "image_id": "image-1",
                        "sub_id": null,
                        "created_at": "2021-08-29T19:31:37.000Z",
                        "value": 1,
                        "country_code": "GB"
                    },
                    {
                        "id": 322334,
                        "image_id": "image-2",
                        "sub_id": null,
                        "created_at": "2021-08-29T20:37:32.000Z",
                        "value": 1,
                        "country_code": "GB"
                    },
                    {
                        "id": 322336,
                        "image_id": "image-3",
                        "sub_id": null,
                        "created_at": "2021-08-29T20:49:09.000Z",
                        "value": 1,
                        "country_code": "GB"
                    }]
            )
        );
    }),
    rest.get(`https://api.thecatapi.com/v1/favourites`, (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(
                [{
                    "id": 2099861,
                    "user_id": "1m1swq",
                    "image_id": "image-1",
                    "sub_id": null,
                    "created_at": "2021-08-30T00:26:53.000Z",
                    "image": {
                        "id": "image-1"
                    }
                }, {
                    "id": 2099863,
                    "user_id": "1m1swq",
                    "image_id": "image-3",
                    "sub_id": null,
                    "created_at": "2021-08-30T01:23:15.000Z",
                    "image": {
                        "id": "image-3"
                    }
                }, {
                    "id": 2099866,
                    "user_id": "1m1swq",
                    "image_id": "image-7",
                    "sub_id": null,
                    "created_at": "2021-08-30T02:47:03.000Z",
                    "image": {
                        "id": "image-7"
                    }
                }]
            )
        );
    })
];