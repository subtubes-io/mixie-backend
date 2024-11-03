import {
  Injectable,
  Inject,
  LoggerService,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateMessageDto } from '@lib/shared/dto/create-message.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { SchemaRegistry, SchemaType } from '@kafkajs/confluent-schema-registry';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly registry: SchemaRegistry;
  private schemaId: number;

  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    // Initialize the Schema Registry with JSON schema support
    this.registry = new SchemaRegistry(
      { host: 'http://localhost:8081' },
      { [SchemaType.JSON]: { strict: true } },
    );
  }

  async onModuleInit() {
    try {
      // Connect to Kafka and ensure the client is ready to emit messages
      await this.kafkaClient.connect();

      // Fetch the latest schema ID for 'MessageEvent'
      const id = await this.registry.getLatestSchemaId('MessageEventJson');
      this.schemaId = id;
      this.logger.log(`Fetched schema ID: ${this.schemaId}`);
    } catch (error) {
      this.logger.error('Failed to fetch schema from registry', error);
      throw error;
    }
  }

  async sendMessage(createMessageDto: CreateMessageDto) {
    const messagePayload = {
      text: createMessageDto.text,
      timestamp: new Date().toISOString(),
    };

    // this.logger.log('Message payload:', messagePayload);

    try {
      // Validate and encode the message using the JSON schema
      const encodedMessage = await this.registry.encode(
        this.schemaId,
        messagePayload,
      );

      // Send the encoded message to Kafka topic 'message_created' and await it
      await this.kafkaClient
        .emit('message_created', encodedMessage)
        .toPromise();

      this.logger.log(
        JSON.stringify({ text: createMessageDto.text }),
        'Message sent to Kafka',
      );
    } catch (error) {
      this.logger.error('Failed to encode or send message', error.message);
      throw error;
    }
  }
}
