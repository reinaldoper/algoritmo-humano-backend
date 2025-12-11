import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    helmet({
      contentSecurityPolicy: true,
      crossOriginEmbedderPolicy: true,
    }),
  );

  app.use(cookieParser());
  app.enableCors({
    origin: ['http://localhost:3000', 'https://algoritmo-humano.netlify.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.setGlobalPrefix('api');
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));
  const config = new DocumentBuilder()
    .setTitle('Documentation API Algorithm Human')
    .setDescription('API for Algorithm Human project')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);
  const PORT = process.env.PORT || 3001;
  await app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/api`);
    console.log(`Swagger is running on http://localhost:${PORT}/api/docs`);
  });
}
void bootstrap();
