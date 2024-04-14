import { HttpResponse } from "../../resp";
import api from '../../api';
import { firstValueFrom } from "rxjs";

export const Login = (data:object):Promise<HttpResponse<Date>> => {
    return  firstValueFrom(
        api.post<Date>("/api/login/requirement",
        data)
    );
  };