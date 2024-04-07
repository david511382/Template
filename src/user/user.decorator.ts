import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserTokenDto } from '../auth/dto/user-token.dto';

type UserTokenDtoKeys = keyof UserTokenDto;

export const UserDecorator = createParamDecorator(
  (key: UserTokenDtoKeys, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return key ? user?.[key] : user;
  },
);
