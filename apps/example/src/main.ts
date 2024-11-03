import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from '@lib/shared/logger/logger.config';
// import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { sdk } from '@lib/shared/telemetry/telemetry.config';

async function bootstrap() {
  await sdk.start();
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });
  // Set up RabbitMQ client options
  // const rabbitMqMicroservice: MicroserviceOptions = {
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: ['amqp://guest:guest@localhost:5672'], // RabbitMQ URL
  //     queue: 'messages_queue', // The queue to listen on
  //     queueOptions: {
  //       durable: false,
  //     },
  //   },
  // };

  // // Register the RabbitMQ microservice
  // app.connectMicroservice(rabbitMqMicroservice);

  // // Start all registered microservices
  // await app.startAllMicroservices();

  app.enableCors({});
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
