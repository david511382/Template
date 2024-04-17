import { HttpResponse } from "../../resp";
import api from '../../api';
import { firstValueFrom } from "rxjs";

export interface Resp {
    id: bigint;
    username: string;
    ip: string;
    request_time: string;
    description: string;
    connect_time: string;
    code: string;
}

export const FetchLoginRequirement = (): Promise<HttpResponse<Resp[]>> => {
    return firstValueFrom(
        api.get<Resp[]>("/login/requirement")
    );
};
