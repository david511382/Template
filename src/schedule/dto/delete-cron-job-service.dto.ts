import { Expose } from 'class-transformer';

export class DeleteCronJobServiceDto {
  @Expose({ name: 'name' })
  name: string;
}
