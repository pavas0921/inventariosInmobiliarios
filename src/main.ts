import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import mongoose from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔍 DEBUG: Verificar variable de entorno
  console.log('MONGO_URI:', process.env.MONGO_URI);

  // 🔍 DEBUG: Eventos de conexión MongoDB
  mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB conectado');
    console.log('📦 DB:', mongoose.connection.name);
    console.log('🌐 Host:', mongoose.connection.host);
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ Error de MongoDB:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB desconectado');
  });

  // Seguridad HTTP Headers
  app.use(helmet());

  // Límite de peticiones por IP
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100,
      message: 'Demasiadas peticiones desde esta IP, intenta más tarde',
    }),
  );

  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Inventarios API')
    .setDescription('Documentación de la API de Inventarios')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'bearer',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // CORS
  app.enableCors({
    origin: ['http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);

  console.log(`Servidor corriendo en http://localhost:${port}`);
  console.log(`Swagger disponible en http://localhost:${port}/api/docs`);
}

bootstrap();
