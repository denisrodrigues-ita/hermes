import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const { ENV } = await import('./config/env');

  const httpsOptions = {
    key: ENV.SSL_KEY,
    cert: ENV.SSL_CRT,
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });

  const port = ENV.PORT;
  await app.listen(port);
}

void bootstrap();
