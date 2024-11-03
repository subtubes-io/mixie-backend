import { Controller, Inject, LoggerService } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { SchemaRegistry } from '@kafkajs/confluent-schema-registry';

@Controller()
export class PipeoneController {
  private readonly registry: SchemaRegistry;

  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    this.registry = new SchemaRegistry({
      host: 'http://localhost:8081',
    });
  }

  @EventPattern('message_created')
  async handleMessage(@Payload() message: Buffer) {
    try {
      // Deserialize the message using the registry
      const decodedMessage = await this.registry.decode(message);
      this.logger.log('Received message', decodedMessage);
      // Process the message as needed
    } catch (error) {
      this.logger.error('Failed to decode message', error);
    }
  }
}
