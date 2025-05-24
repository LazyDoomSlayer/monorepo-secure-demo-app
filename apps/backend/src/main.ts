import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './transform.interceptor';
import { Logger } from '@nestjs/common';
import { DatabaseLogger } from './logging/logging.service';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());

  app.enableCors({
    origin: [
      'http://localhost:4173',
      'http://localhost:5173',
      'https://monorepo-secure-demo-app.lazydoomslayer.dev/',
    ],
    credentials: true,
  });

  app.useLogger(app.get(DatabaseLogger));
  await app.listen(process.env.PORT ?? 3000);
  logger.log(`Application is listening on Port ${process.env.PORT ?? 3000}.`);
}

bootstrap();
