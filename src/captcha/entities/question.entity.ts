import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

class QuestionData {
  id: string;

  html: string;
}

export class Question {
  private readonly _data: QuestionData;

  @Expose()
  @IsString()
  get id(): string {
    return this._data.id;
  }

  @Expose()
  @IsString()
  get html(): string {
    return this._data.html;
  }

  constructor(data: QuestionData) {
    this._data = Object.assign({}, data);
  }
}
