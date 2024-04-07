import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { adpImports, serviceImports } from './auth-module-options.const';
import { IInternalSignServiceType } from '../common/interface/internal-sign.interface';
import { ISignServiceType } from './interface/sign.interface';

@Module({
  imports: [...serviceImports, ...adpImports],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
