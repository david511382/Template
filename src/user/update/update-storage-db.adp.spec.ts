// import { Test, TestingModule } from '@nestjs/testing';
// import { instanceToPlain } from 'class-transformer';
// import { ErrorCode } from '../../common/error/error-code.enum';
// import { Response, newResponse } from '../../common/response';
// import { TestCaseWithEnv } from '../../infra/util/test/test-case-with-env.class';
// import { TestCaseClass, TestCase } from '../../infra/util/test/test-case.class';
// import { TestSuitWithEnv } from '../../infra/util/test/test-suit-with-env.class';
// import { UserDo } from '../entities/user.entity';
// import { GenderEnum } from '../enum/gender.enum';
// import { IUpdateStorageService, IUpdateStorageServiceType } from '../interface/update-storage.interface';
// import { UpdateStorageDbAdp } from './update-storage-db.adp';
// import { infraImports, serviceImports } from './update-adp-module-options.const';
// import { DbService } from '../../infra/db/db.service';

// type TestTargetGetter = () => IUpdateStorageService;

// type UpdateRes = Response<void>;

// type UpdateTestEnv = {
//   userDbService: DbService;
// };

// class UpdateTest extends TestSuitWithEnv<
//   IUpdateStorageService,
//   UserDo,
//   UpdateRes,
//   UpdateTestEnv
// > {
//   private static birthday = new Date();
//   static passedArg(): UserDo {
//     const res =new UserDo(undefined,{
//       id: 1,
//       firstName: '3',
//       lastName: '2',
//       password: '88888888',
//       birthday: this.birthday,
//       gender: GenderEnum.Male,
//     });
//     return res;
//   }

//   protected testcasesClasses: TestCaseClass<
//     UserDo,
//     UpdateRes
//   >[] = [
//     UpdatePassCase,
//     UpdateStoreFailCase,
//   ];

//   async execute(
//     testcase: TestCase<UserDo, UpdateRes>,
//     testTargetGetter: TestTargetGetter,
//   ) {
//     const testTarget = testTargetGetter();
//     const arg = testcase.initArg();
//     const expectRes = testcase.initRes();

//     const actualRes = await testTarget.updateAsync(arg);

//     expect(actualRes).toStrictEqual(expectRes);
//   }

//   protected async defaultInitEnv(testEnvGetter: () => UpdateTestEnv) {
//     const {  userDbService } = testEnvGetter();

//     jest
//       .spyOn(userDbService, 'updateAsync')
//       .mockImplementation(
//         async (user): Promise<Response<void>> => newResponse(),
//       );
//   }
// }

// class UpdatePassCase extends TestCaseWithEnv<
//   UserDo,
//   UpdateRes,
//   UpdateTestEnv
// > {
//   private _mockStorageUpdateAsyncFn: jest.SpyInstance<
//     Promise<Response<void>>,
//     [user: UserDo],
//     any
//   >;

//   async additionalCheck(
//     testTargetGetter: () => TestTargetGetter,
//     testEnvGetter: () => UpdateTestEnv,
//   ) {
//     const arg = this.initArg();

//     {
//       const actual = this._mockStorageUpdateAsyncFn;
//       const expected = 1;
//       expect(actual).toHaveBeenCalledTimes(expected);
//     }
//     {
//       const actualUser =
//         this._mockStorageUpdateAsyncFn.mock.calls[0][0];
//       {
//         const actual = await actualUser.verifyPasswordAsync(arg.password);
//         expect(actual).toBeTruthy();
//       }
//       const actualPlainUser = instanceToPlain(actualUser, {
//         excludeExtraneousValues: true,
//       });
//       delete actualPlainUser.password;
//       const actual = actualPlainUser;
//       const expectedUser = adp.newUser(arg.id);
//       await expectedUser.setAsync(arg);
//       expectedUser.email = 'e';
//       expectedUser.utmCampaign = 'c';
//       expectedUser.utmMedium = 'm';
//       expectedUser.utmSource = 's';
//       const expectedPlainUser = instanceToPlain(expectedUser, {
//         excludeExtraneousValues: true,
//       });
//       delete expectedPlainUser.password;
//       const expected = expectedPlainUser;
//       expect(actual).toStrictEqual(expected);
//     }
//   }

//   initEnv(testEnvGetter: () => UpdateTestEnv) {
//     const { userDbService } = testEnvGetter();

//     this._mockStorageUpdateAsyncFn = jest
//       .spyOn(userDbService, 'updateAsync')
//       .mockImplementation(
//         async (user): Promise<Response<void>> => newResponse<void>(),
//       );
//   }

//   initArg(): UserDo {
//     return UpdateTest.passedArg();
//   }

//   initRes(): UpdateRes {
//     return newResponse<void>();
//   }
// }

// class UpdateStoreFailCase extends TestCaseWithEnv<
//   UserDo,
//   UpdateRes,
//   UpdateTestEnv
// > {
//   initEnv(testEnvGetter: () => UpdateTestEnv) {
//     const { userDbService } = testEnvGetter();

//     jest
//       .spyOn(userDbService, 'updateAsync')
//       .mockImplementation(
//         async (user): Promise<Response<void>> =>
//           newResponse<void>().setMsg(ErrorCode.SYSTEM_FAIL),
//       );
//   }

//   initArg(): UserDo {
//     return UpdateTest.passedArg();
//   }

//   initRes(): UpdateRes {
//     return newResponse<void>().setMsg(ErrorCode.SYSTEM_FAIL);
//   }
// }

// describe('IUpdateStorageService', () => {
//   let adp: IUpdateStorageService;
//   let userDbService: IUserStorageService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       imports: [...infraImports, ...serviceImports],
//       providers: [
//         {
//           provide: IUpdateStorageServiceType,
//           useClass: UpdateStorageDbAdp,
//         },
//       ],
//     }).compile();

//     adp = module.get<IUpdateStorageService>(IUpdateStorageServiceType);
//     userDbService = module.get<DbService>(DbService);
//   });

//   it('should be defined', () => {
//     expect(adp).toBeDefined();
//     expect(userDbService).toBeDefined();
//   });

//   describe('updateAsync Test', () => {
//     new UpdateTest(
//       () => adp,
//       () => ({  userDbService }),
//     ).run();
//   });
// });
