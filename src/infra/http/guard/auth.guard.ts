import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { IS_INTERNAL_KEY, IS_PUBLIC_KEY } from '../decorator/public.decorator';
import { Request } from 'express';
import { ErrorCode } from '../../../common/error/error-code.enum';
import {
  IInternalSignService,
  IInternalSignServiceType,
} from '../../../common/interface/internal-sign.interface';
import {
  ISignService,
  ISignServiceType,
} from '../../../auth/interface/sign.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly _moduleRef: ModuleRef,
    private _reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this._reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    const isInternal = this._reflector.getAllAndOverride<boolean>(
      IS_INTERNAL_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isInternal) {
      const signService = (await this._moduleRef.get(IInternalSignServiceType, {
        strict: false,
      })) as IInternalSignService;
      const verifyInternalTokenAsyncRes =
        await signService.verifyInternalTokenAsync(token);
      if (verifyInternalTokenAsyncRes.errorCode != ErrorCode.SUCCESS) {
        throw new UnauthorizedException();
      }
    } else {
      const signService = (await this._moduleRef.get(ISignServiceType, {
        strict: false,
      })) as ISignService;
      const verifyTokenAsyncRes = await signService.verifyTokenAsync(token);
      if (verifyTokenAsyncRes.errorCode != ErrorCode.SUCCESS) {
        throw new UnauthorizedException();
      }

      request['user'] = verifyTokenAsyncRes.results;
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : request.cookies?.Authorization;
  }
}
