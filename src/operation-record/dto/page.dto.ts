import { IsNumber } from 'class-validator';

export class PageDto {
  @IsNumber()
  page: number;

  @IsNumber()
  index: number;

  constructor(partial?: Partial<PageDto>) {
    if (partial) Object.assign(this, partial);
  }
}
