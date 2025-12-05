import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Seguridad HTTP Headers
  app.use(helmet());

  // Límite de peticiones por IP
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100, // Máx. 100 peticiones por IP
      message: 'Demasiadas peticiones desde esta IP, intenta más tarde',
    }),
  );

  // Validación y transformación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // ==========================
  // Configuración de Swagger
  // ==========================
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
  SwaggerModule.setup('api/docs', app, document); // URL: /api/docs

  // Arrancar servidor
  const port = Number(process.env.PORT) || 3000;

  app.enableCors({
    origin: ['http://localhost:5173'], // origen permitido (tu frontend)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // si usas cookies o headers de autenticación
  });

  await app.listen(port);
  console.log(`Servidor corriendo en http://localhost:${port}`);
  console.log(`Swagger disponible en http://localhost:${port}/api/docs`);
}
bootstrap();
