import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join, resolve } from 'path';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
config();

const configService = new ConfigService();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  
  app.useStaticAssets(resolve('./src/static'));
  app.setBaseViewsDir(resolve('./src/views'));
  app.setViewEngine('ejs');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    }),
  );

  app.enableCors();

  await app.listen(configService.get('PORT') || 3000);
}
bootstrap();
