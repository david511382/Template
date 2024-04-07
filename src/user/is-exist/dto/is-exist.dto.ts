export class IsExistDto {
  constructor(partial?: Partial<IsExistDto>) {
    if (partial) Object.assign(this, partial);
  }

  id?: number;

  email?: string;
}
