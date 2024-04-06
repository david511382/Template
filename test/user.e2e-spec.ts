import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { TestSuitWithEnv } from '../src/infra/util/test/test-suit-with-env.class';
import { TestCaseClass } from '../src/infra/util/test/test-case.class';
import { TestCaseWithEnv } from '../src/infra/util/test/test-case-with-env.class';
import { App } from 'supertest/types';
import { UpdateDto } from '../src/user/dto/update.dto';
import { plainToInstance } from 'class-transformer';
import { AuthService } from '../src/auth/auth.service';
import { AppModule } from '../src/app.module';
import { ErrorCode } from '../src/common/error/error-code.enum';
import { Response, newResponse } from '../src/common/response';
import {
  IUserService,
  IUserServiceType,
} from '../src/user/interface/user-service.interface';
import { AccountTokenDto } from '../src/auth/dto/account-token.dto';
import { IResponse } from '../src/common/interface/response.interface';

type UpdateTestArg = {
  header: Record<string, string>;
  body: Record<string, any>;
};
type UpdateTestRes = { status: HttpStatus; body: IResponse<any> };
type UpdateTestEnv = {
  userService: IUserService;
  authService: AuthService;
};

class UpdateTest extends TestSuitWithEnv<
  App,
  UpdateTestArg,
  UpdateTestRes,
  UpdateTestEnv
> {
  static readonly id: number = 1;
  static passedArg(): UpdateTestArg {
    return {
      header: {
        Authorization: `Bearer ${this.id}`,
      },
      body: {
        first_name: '1',
        last_name: '1',
        password: '1',
        birthday: '2013-08-02T20:13:14Z',
        gender: 1,
      },
    };
  }

  protected testcasesClasses: TestCaseClass<UpdateTestArg, UpdateTestRes>[] = [
    UpdatePassAndEmailNotWorkCase,
    UpdateNoAuthCase,
    UpdateWrongInputFirstNameCase,
    UpdateWrongInputPasswordCase,
    UpdateWrongInputBirthdayCase,
    UpdateWrongInputGenderCase,
    UpdatePasswordLengthCase,
    UpdateNoUserExistCase,
    UpdateSystemFailCase,
    UpdateErrorCase,
  ];

  async execute(
    testcase: TestCaseWithEnv<UpdateTestArg, UpdateTestRes, UpdateTestEnv>,
    testTargetGetter: () => App,
  ) {
    const testTarget = testTargetGetter();
    const arg = testcase.initArg();
    const expectRes = testcase.initRes();

    const body = arg.body;
    const actualRes = await request(testTarget)
      .put(`/user`)
      .set(arg.header)
      .send(body);

    expect(actualRes).toBeDefined();
    {
      const actual = actualRes.body;
      const expected = {
        msg: expectRes.body.msg,
        results: expectRes.body.results
      } as IResponse<any>;
      expect(actual).toEqual(expected);
    }
    {
      const actual = actualRes.status;
      const expected = expectRes.status;
      expect(actual).toStrictEqual(expected);
    }
  }

  protected async defaultInitEnv(testEnvGetter: () => UpdateTestEnv) {
    const { authService } = testEnvGetter();
    jest
      .spyOn(authService, 'verifyTokenAsync')
      .mockImplementation(async (token) => {
        const res = newResponse<AccountTokenDto>();
        try {
          res.results = new AccountTokenDto({ id: parseInt(token) });
        } catch {
          res.setMsg(ErrorCode.VERIFY_FAIL);
        } finally {
          return res;
        }
      });
  }
}

class UpdatePassAndEmailNotWorkCase extends TestCaseWithEnv<
  UpdateTestArg,
  UpdateTestRes,
  UpdateTestEnv
> {
  private _mockUserServiceUpdateUserAsyncFn: jest.SpyInstance<
    Promise<Response<void>>,
    [dto: UpdateDto],
    any
  >;

  additionalCheck(
    testTargetGetter: () => App,
    testEnvGetter: () => UpdateTestEnv,
  ) {
    {
      const actual = this._mockUserServiceUpdateUserAsyncFn;
      const expected = 1;
      expect(actual).toHaveBeenCalledTimes(expected);
    }
    {
      const actual = this._mockUserServiceUpdateUserAsyncFn.mock.calls[0][0];
      const arg = this.initArg();
      const expected = plainToInstance(UpdateDto, arg.body);
      expected.id = UpdateTest.id;
      expect(actual).toEqual(expected);
    }
  }

  initEnv(testEnvGetter: () => UpdateTestEnv) {
    const { userService } = testEnvGetter();
    this._mockUserServiceUpdateUserAsyncFn = jest
      .spyOn(userService, 'updateAsync')
      .mockImplementation(async (dto) => newResponse<void>());
  }

  initArg(): UpdateTestArg {
    const res = UpdateTest.passedArg();
    res.body['email'] = '1@2.tw';
    return res;
  }

  initRes(): UpdateTestRes {
    return {
      status: HttpStatus.ACCEPTED,
      body: newResponse<void>(),
    };
  }
}

class UpdateNoAuthCase extends TestCaseWithEnv<
  UpdateTestArg,
  UpdateTestRes,
  UpdateTestEnv
> {
  initEnv(testEnvGetter: () => UpdateTestEnv) { }

  initArg(): UpdateTestArg {
    const res = UpdateTest.passedArg();
    res.header = {};
    return res;
  }

  initRes(): UpdateTestRes {
    return {
      status: HttpStatus.UNAUTHORIZED,
      body: newResponse<void>().setMsg(ErrorCode.VERIFY_FAIL),
    };
  }
}

class UpdateWrongInputFirstNameCase extends TestCaseWithEnv<
  UpdateTestArg,
  UpdateTestRes,
  UpdateTestEnv
> {
  initEnv(testEnvGetter: () => UpdateTestEnv) { }

  initArg(): UpdateTestArg {
    const res = UpdateTest.passedArg();
    delete res.body.first_name;
    return res;
  }

  initRes(): UpdateTestRes {
    return {
      status: HttpStatus.BAD_REQUEST,
      body: newResponse().setMsg(ErrorCode.WRONG_INPUT),
    };
  }
}

class UpdateWrongInputPasswordCase extends UpdateWrongInputFirstNameCase {
  initArg(): UpdateTestArg {
    const res = UpdateTest.passedArg();
    delete res.body.password;
    return res;
  }
}

class UpdateWrongInputBirthdayCase extends UpdateWrongInputFirstNameCase {
  initArg(): UpdateTestArg {
    const res = UpdateTest.passedArg();
    res.body.birthday = '123';
    return res;
  }
}

class UpdateWrongInputGenderCase extends UpdateWrongInputFirstNameCase {
  initArg(): UpdateTestArg {
    const res = UpdateTest.passedArg();
    res.body.gender = 'M';
    return res;
  }
}

class UpdatePasswordLengthCase extends TestCaseWithEnv<
  UpdateTestArg,
  UpdateTestRes,
  UpdateTestEnv
> {
  initEnv(testEnvGetter: () => UpdateTestEnv) {
    const { userService } = testEnvGetter();
    jest
      .spyOn(userService, 'updateAsync')
      .mockImplementation(async (dto) =>
        newResponse<void>().setMsg(ErrorCode.WRONG_INPUT),
      );
  }

  initArg(): UpdateTestArg {
    return UpdateTest.passedArg();
  }

  initRes(): UpdateTestRes {
    return {
      status: HttpStatus.BAD_REQUEST,
      body: newResponse<void>().setMsg(ErrorCode.WRONG_INPUT),
    };
  }
}

class UpdateNoUserExistCase extends TestCaseWithEnv<
  UpdateTestArg,
  UpdateTestRes,
  UpdateTestEnv
> {
  initEnv(testEnvGetter: () => UpdateTestEnv) {
    const { userService } = testEnvGetter();
    jest
      .spyOn(userService, 'updateAsync')
      .mockImplementation(async (dto) =>
        newResponse<void>().setMsg(ErrorCode.ERR_MSG_ACCOUNT_NOT_EXIST),
      );
  }

  initArg(): UpdateTestArg {
    return UpdateTest.passedArg();
  }

  initRes(): UpdateTestRes {
    return {
      status: HttpStatus.BAD_REQUEST,
      body: newResponse<void>().setMsg(ErrorCode.ERR_MSG_ACCOUNT_NOT_EXIST),
    };
  }
}

class UpdateSystemFailCase extends TestCaseWithEnv<
  UpdateTestArg,
  UpdateTestRes,
  UpdateTestEnv
> {
  initEnv(testEnvGetter: () => UpdateTestEnv) {
    const { userService } = testEnvGetter();

    jest
      .spyOn(userService, 'updateAsync')
      .mockImplementation(async (dto) =>
        newResponse<void>().setMsg(ErrorCode.SYSTEM_FAIL),
      );
  }

  initArg(): UpdateTestArg {
    return UpdateTest.passedArg();
  }

  initRes(): UpdateTestRes {
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      body: newResponse<void>().setMsg(ErrorCode.SYSTEM_FAIL),
    };
  }
}

class UpdateErrorCase extends TestCaseWithEnv<
  UpdateTestArg,
  UpdateTestRes,
  UpdateTestEnv
> {
  initEnv(testEnvGetter: () => UpdateTestEnv) {
    const { userService } = testEnvGetter();

    jest.spyOn(userService, 'updateAsync').mockImplementation(async (dto) => {
      throw Error('123');
    });
  }

  initArg(): UpdateTestArg {
    return UpdateTest.passedArg();
  }

  initRes(): UpdateTestRes {
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      body: newResponse<void>().setMsg(ErrorCode.SYSTEM_FAIL),
    };
  }
}

describe('UserDo', () => {
  let app: INestApplication;
  let userService: IUserService;
  let authService: AuthService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    userService = module.get<IUserService>(IUserServiceType);
    authService = module.get<AuthService>(AuthService);

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/PUT', () => {
    new UpdateTest(
      () => app.getHttpServer(),
      () => ({ userService, authService }),
    ).run();
  });
});
