import { Module } from '@nestjs/common';
import { PipeoneController } from './pipeone.controller';
import { PipeoneService } from './pipeone.service';

@Module({
  imports: [],
  controllers: [PipeoneController],
  providers: [PipeoneService],
})
export class PipeoneModule {}
