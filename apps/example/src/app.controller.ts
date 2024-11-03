import { Controller, Post, Body, Inject, LoggerService } from '@nestjs/common';
import { CreateMessageDto } from '@lib/shared/dto/create-message.dto';
import { AppService } from './app.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @Post()
  async sendMessage(@Body() createMessageDto: CreateMessageDto) {
    this.logger.log('Received message', { text: createMessageDto.text });

    try {
      // Send the message to Kafka
      await this.appService.sendMessage(createMessageDto);
      return { status: 'Message sent to Kafka' };
    } catch (error) {
      this.logger.error('Error sending message to Kafka', error.message);
      throw new Error('Failed to send message to Kafka');
    }
  }
}
