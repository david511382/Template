import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { IConfig } from '../../config/interface/config.interface';
import { INestApplication } from '@nestjs/common';

export function useSwagger(app: INestApplication, config: IConfig) {
  const swaggerConfig = new DocumentBuilder()
    .setTitle(`${config.appName} backend`)
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('doc', app, document);
}
