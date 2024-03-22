export interface IPrismaClient {
  $on(eventType: never, callback: (event: never) => void): void;

  /**
   * Connect with the database
   */
  $connect(): Promise<void>;
}
