import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { IIdFactory } from '../../common/interface/id-factory.interface';
import { Answer } from './answer.entity';
import { Question } from './question.entity';

class CaptchaData {
  html: string;

  code: string;
}

type NewRes = { answer: Answer; question: Question };

export class Captcha {
  private readonly _data: CaptchaData;

  @Expose()
  @IsString()
  get html(): string {
    return this._data.html;
  }

  @Expose()
  @IsString()
  get code(): string {
    return this._data.code;
  }

  constructor(
    private readonly _idFactory: IIdFactory,
    data: CaptchaData,
  ) {
    this._data = Object.assign({}, data);
  }

  new(): NewRes {
    const id = this._idFactory.string();
    const answer = new Answer({
      id,
      code: this._data.code,
    });
    const question = new Question({
      id,
      html: this._data.html,
    });
    return {
      answer,
      question,
    };
  }
}
