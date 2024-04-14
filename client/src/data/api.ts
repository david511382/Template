import {defer, Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import axios, { AxiosResponse } from "axios";
import { HttpResponse, Response } from './resp';

const GetBackendUrl = ()=> process.env.NEXT_PUBLIC_BACKEND_URL 

const request = axios.create({
    baseURL: GetBackendUrl(),
    headers: { 'Content-Type': 'application/json' },
  })

const httpResponseParser=<T>(result:AxiosResponse<Response<T>, any>):HttpResponse<T> => ({code:result.status,res:result.data})

const get = <T>(url: string, queryParams?: object): Observable<HttpResponse<T>> => {
    return defer(()=> request.get<Response<T>>(url, { params: queryParams }))
        .pipe(map(httpResponseParser<T>));
};

const post = <T>(url: string, body: object, queryParams?: object): Observable<HttpResponse<T> > => {
    return defer(()=> request.post<Response<T>>(url, body, { params: queryParams }))
        .pipe(map(httpResponseParser<T>));
};

const put = <T>(url: string, body: object, queryParams?: object): Observable<HttpResponse<T> > => {
    return defer(()=>request.put<Response<T>>(url, body, { params: queryParams }))
        .pipe(map(httpResponseParser<T>));
};

const patch = <T>(url: string, body: object, queryParams?: object): Observable<HttpResponse<T> > => {
    return defer(()=> request.patch<Response<T>>(url, body, { params: queryParams }))
        .pipe(map(httpResponseParser<T>));
};

const deleteR = <T>(url: string, id:number): Observable<HttpResponse<T> > => {
    return defer(() => (request.delete<Response<T>>(`${url}/${id}` )))
        .pipe(map(httpResponseParser<T>)
    );
};

export default { get, post, put, patch, delete: deleteR };