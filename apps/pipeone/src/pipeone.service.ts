import { Injectable } from '@nestjs/common';

@Injectable()
export class PipeoneService {
  getHello(): string {
    return 'Hello World!';
  }
}
