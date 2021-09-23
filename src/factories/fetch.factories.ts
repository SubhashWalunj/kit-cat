import { HttpRequestHeader } from "antd/lib/upload/interface";
import { FETCH_REQUEST_HEADER } from "../constants/fetch-request.constants";
import { HTTP_METHODS } from "../enums/http-methods.enum";

export function createFetchRequestArgs(method: HTTP_METHODS, url: string, headers?: HttpRequestHeader, body?: any): [string, { method: HTTP_METHODS, headers: HttpRequestHeader, body?: any }] {
    switch (method) {
        case HTTP_METHODS.GET:
            return [
                url,
                {
                    method: HTTP_METHODS.GET,
                    headers: { ...FETCH_REQUEST_HEADER, ...headers }
                }
            ];
        case HTTP_METHODS.POST:
            return [
                url,
                {
                    method: HTTP_METHODS.POST,
                    body: body || {},
                    headers: { ...FETCH_REQUEST_HEADER, ...headers }
                }
            ];
        case HTTP_METHODS.DELETE:
            return [
                url,
                {
                    method: HTTP_METHODS.DELETE,
                    headers: { ...FETCH_REQUEST_HEADER, ...headers }
                }
            ];
        default:
            return [
                url,
                {
                    method: HTTP_METHODS.GET,
                    headers: { ...FETCH_REQUEST_HEADER, ...headers }
                }
            ];
    }
}