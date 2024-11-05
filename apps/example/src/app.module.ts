import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from '@lib/shared/logger/logger.config';

@Module({
  imports: [
    WinstonModule.forRoot(winstonConfig),
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['kafka-0:9092', 'kafka-1:9093'], // Kafka broker URL
          },
          consumer: {
            groupId: 'nestjs-kafka-group', // Unique group ID
          },
          producer: {
            allowAutoTopicCreation: true,
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
