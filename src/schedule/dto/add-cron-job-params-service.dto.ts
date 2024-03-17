import { Expose } from 'class-transformer';

export class AddCronJobParamsServiceDto {
  @Expose({ name: 'url' })
  url: string;

  @Expose({ name: 'data' })
  data: Record<string, string>;

  @Expose({ name: 'method' })
  method: string;
}
