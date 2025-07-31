import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { ENV } = await import('./config/env');
  const port = ENV.PORT ?? 3000;
  await app.listen(port);
}
void bootstrap();
