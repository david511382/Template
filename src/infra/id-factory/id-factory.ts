import { v4 as uuidv4 } from 'uuid';

export class IdFactory {
  string(): string {
    return uuidv4();
  }
}
