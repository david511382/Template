import { Expose } from 'class-transformer';

export class QuestionVo {
  @Expose({})
  id: string;

  @Expose({})
  html: string;
}
