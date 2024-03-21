export class FindDto {
  constructor(partial?: Partial<FindDto>) {
    if (partial) Object.assign(this, partial);
  }

  id?: number;

  email?: string;
}
