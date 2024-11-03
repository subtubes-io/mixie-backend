import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from '@lib/shared/logger/logger.config';
import { sdk } from '@lib/shared/telemetry/telemetry.config';

async function bootstrap() {
  await sdk.start();
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
