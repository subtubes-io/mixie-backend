import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PipeoneModule } from './pipeone.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from '@lib/shared/logger/logger.config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PipeoneModule,
    {
      logger: WinstonModule.createLogger(winstonConfig),
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9092', 'localhost:9093'], // Kafka broker URL
        },
        consumer: {
          groupId: 'nestjs-kafka-group', // Unique consumer group ID
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
