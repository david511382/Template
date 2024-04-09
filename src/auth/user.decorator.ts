import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AccountTokenDto } from './dto/account-token.dto';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as AccountTokenDto;
  },
);
