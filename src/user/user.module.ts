import { Module } from '@nestjs/common';
import { CreateModule } from './create/create.module';
import { FindModule } from './find/find.module';
import { IsExistModule } from './is-exist/is-exist.module';
import { UpdateModule } from './update/update.module';

@Module({
  imports: [CreateModule, FindModule, UpdateModule, IsExistModule],
})
export class UserModule {}
