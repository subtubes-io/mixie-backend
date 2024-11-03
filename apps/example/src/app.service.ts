import {
  Injectable,
  Inject,
  LoggerService,
  OnModuleInit,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateMessageDto } from '@lib/shared/dto/create-message.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { SchemaRegistry, SchemaType } from '@kafkajs/confluent-schema-registry';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly registry: SchemaRegistry;
  private schemaId: number;

  constructor(
    @Inject('MESSAGE_SERVICE') private readonly client: ClientProxy,
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
      // Fetch the latest schema ID for 'MessageEvent'
      const id = await this.registry.getLatestSchemaId('MessageEvent');
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

    this.logger.log('Message payload:', messagePayload);

    try {
      // Validate and encode the message using the JSON schema
      const encodedMessage = await this.registry.encode(
        this.schemaId,
        messagePayload,
      );

      // Send the message
      this.client.emit('message_created', encodedMessage);

      this.logger.log('Message sent', { text: createMessageDto.text });
    } catch (error) {
      this.logger.error('Failed to encode message', error.message);
      throw error;
    }
  }
}
