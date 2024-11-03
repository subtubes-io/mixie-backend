import {
  Injectable,
  Inject,
  LoggerService,
  OnModuleInit,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateMessageDto } from '@lib/shared/dto/create-message.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { SchemaRegistry } from '@kafkajs/confluent-schema-registry';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly registry: SchemaRegistry;
  private schemaId: number;

  constructor(
    @Inject('MESSAGE_SERVICE') private readonly client: ClientProxy,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    this.registry = new SchemaRegistry({
      host: 'http://localhost:8888/apis/ccompat/v6',
    });
  }

  async onModuleInit() {
    try {
      // Correctly assign the schema ID
      this.schemaId = await this.registry.getLatestSchemaId('MessageEvent');
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

    // Serialize the message using the schema from the registry
    const buffer = await this.registry.encode(this.schemaId, messagePayload);

    // Send the message
    this.client.emit('message_created', buffer);

    this.logger.log('Message sent', { text: createMessageDto.text });
  }
}
