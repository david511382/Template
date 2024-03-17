import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AccountTokenDto } from '../account/dto/account-token.dto';

type AccountTokenDtoKeys = keyof AccountTokenDto;

export const UserDecorator = createParamDecorator(
  (key: AccountTokenDtoKeys, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return key ? user?.[key] : user;
  },
);
