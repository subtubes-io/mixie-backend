import {
  Controller,
  Inject,
  LoggerService,
  OnModuleInit,
} from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { SchemaRegistry, SchemaType } from '@kafkajs/confluent-schema-registry';

@Controller()
export class PipeoneController implements OnModuleInit {
  private readonly registry: SchemaRegistry;
  private schemaId: number;
  private schema: any;

  constructor(
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
      // Fetch and cache the latest schema
      const id = await this.registry.getLatestSchemaId('MessageEvent');
      const schema = await await this.registry.getSchema(id);
      this.schemaId = id;
      this.schema = schema;
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
    this.logger.log('Received message:', message);

    try {
      // Decode and validate the message using the JSON schema
      const decodedMessage = await this.registry.decode(message);
      this.logger.log('Received decoded message:', decodedMessage);

      // Process the decoded message as needed
    } catch (error) {
      this.logger.error('Failed to decode message', error.message);
    }
  }
}
