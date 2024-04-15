import { defer, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import axios, { AxiosError, AxiosResponse } from "axios";
import { HttpResponse, Response } from './resp';

const GetBackendUrl = () => process.env.NEXT_PUBLIC_BACKEND_URL ?? ''

const request = axios.create({
    baseURL: `${GetBackendUrl()}/api`,
    headers: { 'Content-Type': 'application/json' },
})

const httpResponseParser = <T>(result: AxiosResponse<Response<T>, any>): HttpResponse<T> => ({ code: result.status, res: result.data })

const errParser = <T>(error: any) => {
    const err = error as AxiosError;
    if (!err.response)
        console.log(error);
    const code = err.response?.status ?? 0;
    const res = err.response?.data as Response<T>;
    return of({
        code,
        res,
    });
}

const get = <T>(url: string, queryParams?: object): Observable<HttpResponse<T>> => {
    return defer(() => request.get<Response<T>>(url, { params: queryParams }))
        .pipe(
            map(httpResponseParser<T>),
            catchError<
                HttpResponse<T>,
                Observable<HttpResponse<T>>
            >(errParser),
        );
};

const post = <T>(url: string, body: object, queryParams?: object): Observable<HttpResponse<T>> => {
    return defer(() => request.post<Response<T>>(url, body, { params: queryParams }))
        .pipe(
            map(httpResponseParser<T>),
            catchError<
                HttpResponse<T>,
                Observable<HttpResponse<T>>
            >(errParser),
        );
};

const put = <T>(url: string, body: object, queryParams?: object): Observable<HttpResponse<T>> => {
    return defer(() => request.put<Response<T>>(url, body, { params: queryParams }))
        .pipe(
            map(httpResponseParser<T>),
            catchError<
                HttpResponse<T>,
                Observable<HttpResponse<T>>
            >(errParser),
        );
};

const patch = <T>(url: string, body: object, queryParams?: object): Observable<HttpResponse<T>> => {
    return defer(() => request.patch<Response<T>>(url, body, { params: queryParams }))
        .pipe(
            map(httpResponseParser<T>),
            catchError<
                HttpResponse<T>,
                Observable<HttpResponse<T>>
            >(errParser),
        );
};

const deleteR = <T>(url: string, id: number): Observable<HttpResponse<T>> => {
    return defer(() => (request.delete<Response<T>>(`${url}/${id}`)))
        .pipe(
            map(httpResponseParser<T>),
            catchError<
                HttpResponse<T>,
                Observable<HttpResponse<T>>
            >(errParser),
        );
};

export default { get, post, put, patch, delete: deleteR };