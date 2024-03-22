import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { TestCaseClass, TestCase } from '../infra/util/test/test-case.class';
import { TestSuitWithEnv } from '../infra/util/test/test-suit-with-env.class';
import { UpdateDto } from './dto/update.dto';
import { UserDo } from './entities/utm.entity';
import { TestCaseWithEnv } from '../infra/util/test/test-case-with-env.class';
import { instanceToPlain } from 'class-transformer';
import { IUserServiceType } from './interface/user-service.interface';
import { adpImports, serviceImports } from './user-module-options.const';
import {
  IUpdateStorageService,
  IUpdateStorageServiceType,
} from './interface/update-storage.interface';
import { Response, newResponse } from '../common/response';
import { ErrorCode } from '../common/error/error-code.enum';
import { GenderEnum } from './enum/gender.enum';
import { FindDto } from './dto/find.dto';

type TestTargetGetter = () => UserService;

type UpdateRes = Response<void>;

type UpdateTestEnv = {
  userService: UserService;
  storage: IUpdateStorageService;
};

class UpdateTest extends TestSuitWithEnv<
  UserService,
  UpdateDto,
  UpdateRes,
  UpdateTestEnv
> {
  static passedArg(): UpdateDto {
    const res: UpdateDto = {
      id: 1,
      firstName: '3',
      lastName: '2',
      password: '88888888',
      gender: GenderEnum.Male,
    };
    return res;
  }

  protected testcasesClasses: TestCaseClass<UpdateDto, UpdateRes>[] = [
    UpdatePassCase,
    UpdateNotExistCase,
    UpdatePasswordLengthFailCase,
    UpdateStoreFailCase,
  ];

  async execute(
    testcase: TestCase<UpdateDto, UpdateRes>,
    testTargetGetter: TestTargetGetter,
  ) {
    const testTarget = testTargetGetter();
    const arg = testcase.initArg();
    const expectRes = testcase.initRes();

    const actualRes = await testTarget.updateAsync(arg);

    expect(actualRes).toStrictEqual(expectRes);
  }

  protected async defaultInitEnv(testEnvGetter: () => UpdateTestEnv) {
    const { userService, storage } = testEnvGetter();
    const arg = UpdateTest.passedArg();

    jest
      .spyOn(userService, 'findAsync')
      .mockImplementation(async (dto): Promise<Response<UserDo>> => {
        const user = userService.newUser(arg.id);
        user.email = 'e';
        user.utmCampaign = 'c';
        user.utmMedium = 'm';
        user.utmSource = 's';
        return newResponse<UserDo>(user);
      });

    jest
      .spyOn(storage, 'updateAsync')
      .mockImplementation(
        async (user): Promise<Response<void>> => newResponse(),
      );
  }
}

class UpdatePassCase extends TestCaseWithEnv<
  UpdateDto,
  UpdateRes,
  UpdateTestEnv
> {
  private _mockUserServiceFindUserAsyncFn: jest.SpyInstance<
    Promise<Response<UserDo>>,
    [dto: FindDto],
    any
  >;
  private _mockStorageUpdateAsyncFn: jest.SpyInstance<
    Promise<Response<void>>,
    [user: UserDo],
    any
  >;

  async additionalCheck(
    testTargetGetter: () => TestTargetGetter,
    testEnvGetter: () => UpdateTestEnv,
  ) {
    const { userService } = testEnvGetter();
    const arg = this.initArg();
    {
      const actual = this._mockUserServiceFindUserAsyncFn;
      const expected = 1;
      expect(actual).toHaveBeenCalledTimes(expected);
    }
    {
      const actual = this._mockUserServiceFindUserAsyncFn.mock.calls[0][0];
      const expected = { id: arg.id };
      expect(actual).toEqual(expected);
    }

    {
      const actual = this._mockStorageUpdateAsyncFn;
      const expected = 1;
      expect(actual).toHaveBeenCalledTimes(expected);
    }
    {
      const actualUser = this._mockStorageUpdateAsyncFn.mock.calls[0][0];
      {
        const actual = await actualUser.verifyPasswordAsync(arg.password);
        expect(actual).toBeTruthy();
      }
      const actualPlainUser = instanceToPlain(actualUser, {
        excludeExtraneousValues: true,
      });
      delete actualPlainUser.password;
      const actual = actualPlainUser;
      const expectedUser = userService.newUser(arg.id);
      await expectedUser.setAsync(arg);
      expectedUser.email = 'e';
      expectedUser.utmCampaign = 'c';
      expectedUser.utmMedium = 'm';
      expectedUser.utmSource = 's';
      const expectedPlainUser = instanceToPlain(expectedUser, {
        excludeExtraneousValues: true,
      });
      delete expectedPlainUser.password;
      const expected = expectedPlainUser;
      expect(actual).toStrictEqual(expected);
    }
  }

  initEnv(testEnvGetter: () => UpdateTestEnv) {
    const { userService, storage } = testEnvGetter();
    const arg = this.initArg();

    this._mockUserServiceFindUserAsyncFn = jest
      .spyOn(userService, 'findAsync')
      .mockImplementation(async (dto): Promise<Response<UserDo>> => {
        const user = userService.newUser(arg.id);
        user.email = 'e';
        user.utmCampaign = 'c';
        user.utmMedium = 'm';
        user.utmSource = 's';
        return newResponse<UserDo>(user);
      });

    this._mockStorageUpdateAsyncFn = jest
      .spyOn(storage, 'updateAsync')
      .mockImplementation(
        async (user): Promise<Response<void>> => newResponse<void>(),
      );
  }

  initArg(): UpdateDto {
    return UpdateTest.passedArg();
  }

  initRes(): UpdateRes {
    return newResponse<void>();
  }
}

class UpdateNotExistCase extends TestCaseWithEnv<
  UpdateDto,
  UpdateRes,
  UpdateTestEnv
> {
  initEnv(testEnvGetter: () => UpdateTestEnv) {
    const { userService } = testEnvGetter();

    jest
      .spyOn(userService, 'findAsync')
      .mockImplementation(
        async (dto): Promise<Response<UserDo>> =>
          newResponse<UserDo>(undefined),
      );
  }

  initArg(): UpdateDto {
    return UpdateTest.passedArg();
  }

  initRes(): UpdateRes {
    return newResponse<void>().setMsg(ErrorCode.ERR_MSG_ACCOUNT_NOT_EXIST);
  }
}

class UpdatePasswordLengthFailCase extends TestCaseWithEnv<
  UpdateDto,
  UpdateRes,
  UpdateTestEnv
> {
  initEnv(testEnvGetter: () => UpdateTestEnv) {}

  initArg(): UpdateDto {
    const arg = UpdateTest.passedArg();
    arg.password = '';
    return arg;
  }

  initRes(): UpdateRes {
    return newResponse<void>().setMsg(ErrorCode.WRONG_INPUT);
  }
}

class UpdateStoreFailCase extends TestCaseWithEnv<
  UpdateDto,
  UpdateRes,
  UpdateTestEnv
> {
  initEnv(testEnvGetter: () => UpdateTestEnv) {
    const { storage } = testEnvGetter();

    jest
      .spyOn(storage, 'updateAsync')
      .mockImplementation(
        async (user): Promise<Response<void>> =>
          newResponse<void>().setMsg(ErrorCode.SYSTEM_FAIL),
      );
  }

  initArg(): UpdateDto {
    return UpdateTest.passedArg();
  }

  initRes(): UpdateRes {
    return newResponse<void>().setMsg(ErrorCode.SYSTEM_FAIL);
  }
}

describe('UserService', () => {
  let userService: UserService;
  let updateStorageService: IUpdateStorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...serviceImports, ...adpImports],
      providers: [
        {
          provide: IUserServiceType,
          useClass: UserService,
        },
      ],
    }).compile();

    userService = module.get<UserService>(IUserServiceType);
    updateStorageService = module.get<IUpdateStorageService>(
      IUpdateStorageServiceType,
    );
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(updateStorageService).toBeDefined();
  });

  describe('updateAsync Test', () => {
    new UpdateTest(
      () => userService,
      () => ({ userService, storage: updateStorageService }),
    ).run();
  });
});
