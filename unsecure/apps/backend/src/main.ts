import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/transform.interceptor';
import { Logger } from '@nestjs/common';
import { DatabaseLogger } from './modules/logging/logging.service';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());

  app.enableCors();

  app.useLogger(app.get(DatabaseLogger));
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  console.log(`Application is listening on Port ${process.env.PORT ?? 3000}.`);
  logger.log(`Application is listening on Port ${process.env.PORT ?? 3000}.`);
}

bootstrap();
