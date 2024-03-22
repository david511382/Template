import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { IUserServiceType } from './interface/user-service.interface';
import { serviceImports, adpImports } from './user-module-options.const';
import { UserService } from './user.service';

@Module({
  imports: [...serviceImports, ...adpImports],
  providers: [
    {
      provide: IUserServiceType,
      useClass: UserService,
    },
  ],
  controllers: [UserController],
  exports: [IUserServiceType],
})
export class UserModule {}
