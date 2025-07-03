/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable swagger
  const config = new DocumentBuilder()
    .setTitle('Infoteam Newbies API')
    .setDescription('API for Infoteam Newbies')
    .setVersion('1.0')
    .build();
  SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, config));
  // Turn on application
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
