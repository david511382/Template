import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { IIdeServiceType } from './interface/ide-service.interface';
import { IdeAdpService } from './ide-adp.service';
import { serviceImports, adpImports } from './login-module-options.const';
import { LoginRequirementFactory } from './login-requirement-factory';

@Module({
  imports: [...serviceImports, ...adpImports],
  controllers: [LoginController],
  providers: [
    LoginService,
    LoginRequirementFactory,
    {
      provide: IIdeServiceType,
      useClass: IdeAdpService,
    },
  ],
})
export class LoginModule {}
