import { NestFactory } from '@nestjs/core';
import { PipeoneModule } from './pipeone.module';

async function bootstrap() {
  const app = await NestFactory.create(PipeoneModule);
  await app.listen(process.env.port ?? 3001);
}
bootstrap();
