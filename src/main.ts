import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable global validation pipe
  app.useGlobalPipes(new (await import('@nestjs/common')).ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
