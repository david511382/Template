import { HttpResponse } from "../../resp";
import api from '../../api';
import { firstValueFrom } from "rxjs";

export interface Resp {
    username: string;
}

export const DenyLoginRequirement = (id: bigint): Promise<HttpResponse<Resp>> => {
    return firstValueFrom(
        api.delete<Resp>("/login/requirement", id)
    );
};
