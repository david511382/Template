import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { Metadata } from '../infra/http/metadata';
import { Request } from 'express';
import { ErrorCode } from '../common/error/error-code.enum';
import {
  IInternalSignService,
  IInternalSignServiceType,
} from '../common/interface/internal-sign.interface';
import { ISignService, ISignServiceType } from './interface/sign.interface';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(AuthService) private readonly _authService: AuthService,
    private _reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this._reflector.getAllAndOverride<boolean>(
      Metadata.Public,
      [context.getHandler(), context.getClass()],
    );
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
      Metadata.Internal,
      [context.getHandler(), context.getClass()],
    );
    if (isInternal) {
      const verifyInternalTokenAsyncRes =
        await this._authService.verifyInternalTokenAsync(token);
      if (verifyInternalTokenAsyncRes.errorCode != ErrorCode.SUCCESS) {
        throw new HttpException(
          verifyInternalTokenAsyncRes.errorCode,
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      const verifyTokenAsyncRes =
        await this._authService.verifyTokenAsync(token);
      if (verifyTokenAsyncRes.errorCode != ErrorCode.SUCCESS) {
        throw new HttpException(
          verifyTokenAsyncRes.errorCode,
          HttpStatus.BAD_REQUEST,
        );
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
