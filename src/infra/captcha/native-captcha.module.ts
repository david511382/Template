import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { NativeCaptchaService } from './native-captcha.service';
import { ICaptchaFactoryType } from '../../captcha/interface/captcha-factory.interface';

@Module({
  imports: [CommonModule],
  providers: [
    {
      provide: ICaptchaFactoryType,
      useClass: NativeCaptchaService,
    },
  ],
  exports: [ICaptchaFactoryType],
})
export class NativeCaptchaModule {}
