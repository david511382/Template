import { Module } from '@nestjs/common';
import { IdeService } from './ide.service';
import { HttpModule } from '@nestjs/axios';
import { INativeIdeServiceType } from '../../common/interface/native-ide-service.interface.';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [CommonModule, HttpModule],
  providers: [
    {
      provide: INativeIdeServiceType,
      useClass: IdeService,
    },
  ],
  exports: [INativeIdeServiceType],
})
export class IdeModule {}
