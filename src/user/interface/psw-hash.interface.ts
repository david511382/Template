import { Response } from "../../common/response";

export interface IPswHash {
  hashAsync(psw: string): Promise<Response<string>>;
  checkAsync(psw: string, hash: string): Promise<Response<boolean>>;
}

export const IPswHashType = Symbol('IPswHash');
