import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

export async function createApp() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api');

  // CORS - Permettre les connexions depuis le frontend (Local, Mobile et Production)
  const allowedOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map((origin) => origin.trim())
    : [
        'http://localhost:3000', // Port Next.js standard par défaut
        'http://localhost:5173', 
        'http://localhost:5174', 
        'http://172.21.16.1:3000', // 🎯 INDISPENSABLE : Autorise ton IP réseau Frontend
        'http://172.21.16.1:3001', // Autorise ton IP réseau Backend
        'https://salesconnected-frontend.vercel.app' 
      ];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('SFA API')
    .setDescription('Sales Force Automation API - Complete Backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  return app;
}

async function bootstrap() {
  const app = await createApp();
  // Note : D'après tes logs précédents, ton port est configuré sur 3001 (NestJS) pour ne pas boxer avec Next.js (3000)
  const port = process.env.PORT || 3001; 
  await app.listen(port, '0.0.0.0'); // Écouter sur toutes les interfaces pour accès mobile
  console.log(`🚀 Application is running on: http://172.21.16.1:${port}`);
  console.log(`📚 Swagger docs: http://172.21.16.1:${port}/api/docs`);
}

if (require.main === module) {
  bootstrap();
}