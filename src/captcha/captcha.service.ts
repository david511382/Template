import { Inject, Injectable, LoggerService, Scope } from '@nestjs/common';
import {
  ICreateCacheService,
  ICreateCacheServiceType,
} from './interface/create-cache-service.interface';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Response, newResponse } from '../common/response';
import { ErrorCode } from '../common/error/error-code.enum';
import { ILoggerServiceType } from '../infra/log/interface/logger.interface';
import { QuestionDto } from './dto/question.dto';
import { Answer } from './entities/answer.entity';
import {
  ICaptchaFactoryType,
  ICaptchaFactory,
} from './interface/captcha-factory.interface';
import { Captcha } from './entities/captcha.entity';
import { Question } from './entities/question.entity';
import { AnswerServiceDto } from './dto/answer.dto';
import {
  IVerifyCacheService,
  IVerifyCacheServiceType,
} from './interface/verify-cache-service.interface';

@Injectable()
export class CaptchaService {
  constructor(
    @Inject(ILoggerServiceType) private readonly _logger: LoggerService,
    @Inject(ICaptchaFactoryType)
    private readonly _captchaFactory: ICaptchaFactory,
    @Inject(ICreateCacheServiceType)
    private readonly _createCacheService: ICreateCacheService,
    @Inject(IVerifyCacheServiceType)
    private readonly _verifyCacheService: IVerifyCacheService,
  ) { }

  async createAsync(): Promise<Response<QuestionDto>> {
    const res = newResponse<QuestionDto>();

    let captcha: Captcha;
    {
      const createRes = await this._captchaFactory.create();
      switch (createRes.errorCode) {
        case ErrorCode.SUCCESS:
          captcha = createRes.results;
          break;
        default:
          return res.setMsg(ErrorCode.SYSTEM_FAIL);
      }
    }

    let question: Question;
    let answer: Answer;
    {
      const newRes = captcha.new();
      answer = newRes.answer;
      question = newRes.question;
    }

    {
      const saveAnswerAsyncRes =
        await this._createCacheService.saveAnswerAsync(answer);
      switch (saveAnswerAsyncRes.errorCode) {
        case ErrorCode.SUCCESS:
          break;
        default:
          return res.setMsg(ErrorCode.SYSTEM_FAIL);
      }
    }

    try {
      const plainQuestion = instanceToPlain(question, {
        excludeExtraneousValues: true,
      });
      res.results = plainToInstance(QuestionDto, plainQuestion);
    } catch (e) {
      this._logger.error(e);
      return res.setMsg(ErrorCode.SYSTEM_FAIL);
    }

    return res;
  }

  async verifyAsync(dto: AnswerServiceDto): Promise<Response<boolean>> {
    const res = newResponse<boolean>();

    let answer: Answer;
    {
      const findAnswerAsyncRes = await this._verifyCacheService.findAnswerAsync(
        dto.id,
      );
      switch (findAnswerAsyncRes.errorCode) {
        case ErrorCode.SUCCESS:
          answer = findAnswerAsyncRes.results;
          break;
        case ErrorCode.NOT_FOUND:
          res.results = false;
          return res;
        default:
          return res.setMsg(ErrorCode.SYSTEM_FAIL);
      }
    }

    res.results = answer.verify(dto);

    return res;
  }
}
