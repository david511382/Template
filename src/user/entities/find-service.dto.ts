export class FindServiceDto {
  constructor(partial?: Partial<FindServiceDto>) {
    if (partial) Object.assign(this, partial);
  }

  id?: number;

  email?: string;
}
