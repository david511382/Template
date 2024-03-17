import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

class AnswerData {
  id: string;

  code: string;
}

export class Answer {
  private readonly _data: AnswerData;

  @Expose()
  @IsString()
  get id(): string {
    return this._data.id;
  }

  @Expose()
  @IsString()
  get code(): string {
    return this._data.code;
  }

  constructor(data: AnswerData) {
    this._data = Object.assign({}, data);
  }

  verify(answer: Partial<AnswerData>): boolean {
    return this._data.code === answer.code && this._data.id === answer.id;
  }
}
