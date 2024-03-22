import { DynamicModule, Module, Scope } from '@nestjs/common';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { IConfig, IConfigType } from '../../config/interface/config.interface';
import { SignService } from './sign.service';
import { SignModuleOptions } from '../interface/sign-module-options.interface';

@Module({})
export class SignModule {
  static register(options: SignModuleOptions): DynamicModule {
    const signOptions: JwtSignOptions = {};
    if (options.expiresIn) signOptions.expiresIn = options.expiresIn;
    return {
      module: SignModule,
      imports: [
        JwtModule.registerAsync({
          useFactory: (config: IConfig) => ({
            secret: config.auth.jwtKey,
            signOptions,
          }),
          inject: [{ token: IConfigType, optional: false }],
        }),
      ],
      providers: [
        {
          provide: options.token,
          useClass: SignService,
        },
      ],
      exports: [options.token],
    };
  }
}
