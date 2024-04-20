import { HttpResponse } from '../../resp';
import api from '../../api';
import { firstValueFrom } from 'rxjs';

export const ManagerLogin = (
  body: object,
  header: Record<string, string>,
): Promise<HttpResponse<string>> => {
  return firstValueFrom(api.post<string>('/auth/login', { body, header }));
};
