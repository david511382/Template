import { HttpResponse } from '../../resp';
import api from '../../api';
import { firstValueFrom } from 'rxjs';

export interface Resp {
  html: string;
  id: string;
}

export const GetCaptcha = (): Promise<HttpResponse<Resp>> => {
  return firstValueFrom(api.post<Resp>('/captcha'));
};
