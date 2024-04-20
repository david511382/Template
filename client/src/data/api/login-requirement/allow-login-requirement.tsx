import { HttpResponse } from '../../resp';
import api from '../../api';
import { firstValueFrom } from 'rxjs';

export interface Resp {
  username: string;
  end_time: Date;
}

export const AllowLoginRequirement = (
  id: bigint,
): Promise<HttpResponse<Resp>> => {
  return firstValueFrom(api.post<Resp>(`/login/requirement/${id}`));
};
