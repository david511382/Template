import { Injectable, Inject } from "@nestjs/common";
import { User, UserEntity } from "./entities/utm.entity";
import { IPswHashType, IPswHash } from "./interface/psw-hash.interface";
import { IUserFactory } from "./interface/user-factory.interface";

@Injectable()
export class UserFactory implements IUserFactory {
    constructor(
        @Inject(IPswHashType) private readonly _pswHash: IPswHash,
      ) {}

      create( partial?: Partial<UserEntity>): User {
        return new User(this._pswHash, partial);
      }
}