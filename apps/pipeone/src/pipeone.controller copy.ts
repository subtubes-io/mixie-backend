import {
  Controller,
  Inject,
  LoggerService,
  OnModuleInit,
} from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { SchemaRegistry } from '@kafkajs/confluent-schema-registry';

@Controller()
export class PipeoneController implements OnModuleInit {
  private readonly registry: SchemaRegistry;
  private schemaId: number;

  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    this.registry = new SchemaRegistry({
      host: 'http://localhost:8081',
    });
  }

  async onModuleInit() {
    try {
      // Fetch and cache the schema ID on initialization
      const id = await this.registry.getLatestSchemaId('MessageEventJson');
      const schema = await this.registry.getSchema(id);

      this.logger.log(schema, 'fuck');
      this.schemaId = id;
      this.logger.log(`Fetched and cached schema ID: ${this.schemaId}`);
    } catch (error) {
      this.logger.error(
        'Failed to fetch schema from registry on initialization',
        error,
      );
      throw new Error('Failed to initialize schema registry: ' + error.message);
    }
  }
  @EventPattern('message_created')
  async handleMessage(@Payload() message: any) {
    // Log the entire message object for debugging

    this.logger.log('Received message object:', JSON.stringify(message));

    // Access the message value, which should be a Buffer
    const messageValue = message;

    // Verify that messageValue is a Buffer
    if (Buffer.isBuffer(messageValue)) {
      this.logger.log(
        `Raw message payload in hex: ${messageValue.toString('hex')}`,
      );

      try {
        // Decode the message using the cached schema
        const decodedMessage = await this.registry.decode(messageValue);
        this.logger.log('Received decoded message:', decodedMessage);

        // Process the decoded message as needed
        // For example, you can call a service method or perform business logic here
      } catch (error) {
        this.logger.error('Failed to decode message', error.message);
      }
    } else {
      this.logger.error('Message value is not a Buffer');
    }
  }
}
