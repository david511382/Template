export interface HttpResponse<T>{
    code:number
    res?:Response<T>
}

export interface Response<T>{
    msg:string
    results?:T
}