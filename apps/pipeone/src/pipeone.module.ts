import { Module } from '@nestjs/common';
import { PipeoneController } from './pipeone.controller';
import { PipeoneService } from './pipeone.service';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from '@lib/shared/logger/logger.config';

@Module({
  imports: [WinstonModule.forRoot(winstonConfig)],
  controllers: [PipeoneController],
  providers: [PipeoneService],
})
export class PipeoneModule {}
