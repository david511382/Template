import { Test, TestingModule } from '@nestjs/testing';
import { Response, newResponse } from '../../common/response';
import { instanceToPlain } from 'class-transformer';
import { ErrorCode } from '../../common/error/error-code.enum';
import { TestCaseWithEnv } from '../../infra/util/test/test-case-with-env.class';
import { TestCaseClass, TestCase } from '../../infra/util/test/test-case.class';
import { TestSuitWithEnv } from '../../infra/util/test/test-suit-with-env.class';
import { UserDo } from '../do/user.do';
import { GenderEnum } from '../enum/gender.enum';
import { FindDto } from '../find/dto/find.dto';
import { IUpdateService, IUpdateServiceType } from '../interface/update-service.interface';
import { UpdateDto } from './dto/update.dto';
import { infraImports, serviceImports } from './update-module-options.const';
import { UpdateService } from './update.service';
import { IFindService, IFindServiceType } from '../interface/find-service.interface';
import { FindService } from '../find/find.service';
import { UserFactory } from '../user-factory';
import { IUpdateStorageService, IUpdateStorageServiceType } from './interface/update-storage.interface';
import { commonProviders } from '../common.provider';
import { UpdateStorageDbAdp } from './update-storage-db.adp';

type TestTargetGetter = () => IUpdateService;

type UpdateRes = Response<void>;

type UpdateTestEnv = {
  findService: IFindService;
  updateStorage: IUpdateStorageService;
  userFactory: UserFactory;
};

class UpdateTest extends TestSuitWithEnv<
  IUpdateService,
  UpdateDto,
  UpdateRes,
  UpdateTestEnv
> {
  static passedArg(): UpdateDto {
    const res: UpdateDto = {
      password: '',
      firstName: '',
      lastName: '',
      gender: GenderEnum.Male,
      birthday: undefined,
      id: 0
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

    const actualRes = await testTarget.runAsync(arg);

    expect(actualRes).toStrictEqual(expectRes);
  }

  protected async defaultInitEnv(testEnvGetter: () => UpdateTestEnv) {
    const { findService, updateStorage, userFactory } = testEnvGetter();
    const arg = UpdateTest.passedArg();

    jest
      .spyOn(findService, 'runAsync')
      .mockImplementation(async (dto): Promise<Response<UserDo>> => {
        const user = userFactory.create({
          id: arg.id,
          email: 'e',
        },
          {
            campaign: 'c',
            medium: 'm',
            source: 's',
          });
        return newResponse<UserDo>(user);
      });

    jest
      .spyOn(updateStorage, 'updateAsync')
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
  private _mockIUpdateServiceFindUserAsyncFn: jest.SpyInstance<
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
    const { userFactory } = testEnvGetter();
    const arg = this.initArg();
    {
      const actual = this._mockIUpdateServiceFindUserAsyncFn;
      const expected = 1;
      expect(actual).toHaveBeenCalledTimes(expected);
    }
    {
      const actual = this._mockIUpdateServiceFindUserAsyncFn.mock.calls[0][0];
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
      const expectedUser = userFactory.create({
        id: arg.id,
        email: 'e',
      }, {
        campaign: 'c',
        medium: 'm',
        source: 's',
      });
      await expectedUser.setAsync(arg);
      const expectedPlainUser = instanceToPlain(expectedUser, {
        excludeExtraneousValues: true,
      });
      delete expectedPlainUser.password;
      const expected = expectedPlainUser;
      expect(actual).toStrictEqual(expected);
    }
  }

  initEnv(testEnvGetter: () => UpdateTestEnv) {
    const { findService, updateStorage, userFactory } = testEnvGetter();
    const arg = this.initArg();

    this._mockIUpdateServiceFindUserAsyncFn = jest
      .spyOn(findService, 'runAsync')
      .mockImplementation(async (dto): Promise<Response<UserDo>> => {
        const user = userFactory.create({
          id: arg.id,
          email: 'e',
        }, {
          campaign: 'c',
          medium: 'm',
          source: 's',
        });
        return newResponse<UserDo>(user);
      });

    this._mockStorageUpdateAsyncFn = jest
      .spyOn(updateStorage, 'updateAsync')
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
    const { findService } = testEnvGetter();

    jest
      .spyOn(findService, 'runAsync')
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
  initEnv(testEnvGetter: () => UpdateTestEnv) { }

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
    const { updateStorage } = testEnvGetter();

    jest
      .spyOn(updateStorage, 'updateAsync')
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

describe('IUpdateService', () => {
  let updateService: IUpdateService;
  let updateTestEnv: UpdateTestEnv = {
    findService: undefined,
    updateStorage: undefined,
    userFactory: undefined
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...infraImports, ...serviceImports],
      providers: [
        ...commonProviders,
        {
          provide: IUpdateServiceType,
          useClass: UpdateService,
        },
        {
          provide: IUpdateStorageServiceType,
          useClass: UpdateStorageDbAdp,
        },
      ],
    }).compile();

    updateService = module.get<IUpdateService>(IUpdateServiceType);
    updateTestEnv.userFactory = module.get(UserFactory);
    updateTestEnv.findService = module.get<IFindService>(IFindServiceType);
    updateTestEnv.updateStorage = module.get<IUpdateStorageService>(
      IUpdateStorageServiceType,
    );
  });

  it('should be defined', () => {
    expect(updateService).toBeDefined();
  });

  describe('runAsync Test', () => {
    new UpdateTest(
      () => updateService,
      () => (updateTestEnv),
    ).run();
  });
});
