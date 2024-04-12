import { Injectable, Scope } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable({ scope: Scope.REQUEST })
export class RequestIdFactory {
  private readonly UUID;

  constructor() {
    this.UUID = uuidv4();
  }

  get(): string {
    return this.UUID;
  }
}
