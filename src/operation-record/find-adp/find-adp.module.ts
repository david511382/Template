import { Module } from '@nestjs/common';
import { infraImports, serviceImports } from './find-adp-module-options.const';

@Module({
  imports: [...infraImports, ...serviceImports],
  providers: [],
})
export class FindAdpModule {}
