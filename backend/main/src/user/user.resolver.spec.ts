import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { testList } from '../test/list.tester';
import { SeedModule } from '../seed/seed.module';
import { GeneratorGraphqlService } from '../seed/generator-graphql/generator-graphql.service';
import { mockRepository, proxyMock } from '../test/proxy.mock';
import { Role, TokenType } from '../graphql/ts/types';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { User } from './user.entity';
import * as _ from 'lodash';
import { GeneratorOrmService } from '../seed/generator-orm/generator-orm.service';
import { TokenService } from './token/token.service';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let userService: UserService;
  let tokenService: TokenService;
  let gqlGenerator: GeneratorGraphqlService;
  let ormGenerator: GeneratorOrmService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SeedModule],
      providers: [
        UserResolver,
        {
          provide: UserService,
          useValue: mockRepository(),
        },
        {
          provide: TokenService,
          useValue: proxyMock(),
        },
      ],
    }).compile();
    resolver = module.get<UserResolver>(UserResolver);
    userService = module.get<UserService>(UserService);
    tokenService = module.get<TokenService>(TokenService);
    gqlGenerator = module.get<GeneratorGraphqlService>(GeneratorGraphqlService);
    ormGenerator = module.get<GeneratorOrmService>(GeneratorOrmService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
    expect(userService).toBeDefined();
    expect(tokenService).toBeDefined();
    expect(gqlGenerator).toBeDefined();
    expect(ormGenerator).toBeDefined();
  });

  it('should fetch all users', async () => {
    const spy = jest.spyOn(userService, 'findAndCount');
    const result = await resolver.allUsers();
    expect(spy).toBeCalledWith(undefined);
    testList(result);
  });

  it('should fetch all users with fulltext search', async () => {
    const query = 'query';
    const spy = jest.spyOn(userService, 'findAndCount');
    const result = await resolver.allUsers({ query });
    expect(spy).toBeCalledWith({ query });
    testList(result);
  });

  it('should fetch all users with fulltext search and pagination', async () => {
    const query = 'query';
    const pagination = { limit: 10, offset: 20 };
    const spy = jest.spyOn(userService, 'findAndCount');
    const result = await resolver.allUsers({ query, pagination });
    expect(spy).toBeCalledWith({ query, pagination });
    testList(result);
  });

  it('should fetch all users with pagination', async () => {
    const pagination = { limit: 10, offset: 20 };
    const spy = jest.spyOn(userService, 'findAndCount');
    const result = await resolver.allUsers({ pagination });
    expect(spy).toBeCalledWith({ pagination });
    testList(result);
  });

  it('should find user by id', async () => {
    const id = 'id';
    const spy = jest.spyOn(userService, 'findById');
    await resolver.user(id, {
      id,
      email: 'any',
      role: Role.USER,
    });
    expect(spy).toBeCalledWith(id);
  });

  it('should fail fetch due to invalid id', async () => {
    const id = 'id';
    await expect(
      resolver.user(id, {
        id: 'invalid-id',
        email: 'any',
        role: Role.USER,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should find myself', async () => {
    const id = 'id';
    const spy = jest
      .spyOn(userService, 'findById')
      .mockImplementation(async () => new User());
    await resolver.me({
      id,
      email: 'any',
      role: Role.USER,
    });
    expect(spy).toBeCalledWith(id);
  });

  it('should update user', async () => {
    const id = 'id';
    const userUpdateInput = gqlGenerator.userUpdate();
    const spy = jest
      .spyOn(userService, 'update')
      .mockImplementation(async () => new User());
    await resolver.userUpdate(id, userUpdateInput, {
      id,
      email: 'any',
      role: Role.USER,
    });
    expect(spy).toBeCalledWith(
      id,
      _.omit(userUpdateInput, ['password', 'passwordRepeat']),
    );
  });

  it('should fail update user due to non-existing user', async () => {
    const id = 'id';
    const userUpdateInput = gqlGenerator.userUpdate();
    jest.spyOn(userService, 'update').mockImplementation(async () => undefined);
    await expect(
      resolver.userUpdate(id, userUpdateInput, {
        id,
        email: 'any',
        role: Role.USER,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should fail update user due to insufficient permissions', async () => {
    const id = 'id';
    const userUpdateInput = gqlGenerator.userUpdate();
    jest.spyOn(userService, 'update').mockImplementation(async () => undefined);
    await expect(
      resolver.userUpdate(id, userUpdateInput, {
        id: 'any-other-id',
        email: 'any',
        role: Role.USER,
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('should resolve emailValidated field to false', async () => {
    const user = ormGenerator.user(false);
    const token = ormGenerator.token(false);
    token.valid = true;
    token.tokenType = TokenType.EMAIL_CONFIRMATION;
    user.tokens = Promise.resolve([token]);
    expect(await resolver.resolveEmailValidated(user)).toBeFalsy();
  });

  it('should resolve emailValidated field to true', async () => {
    const user = ormGenerator.user(false);
    const token = ormGenerator.token(false);
    token.tokenType = TokenType.PASSWORD_RESET;
    user.tokens = Promise.resolve([token]);
    expect(await resolver.resolveEmailValidated(user)).toBeTruthy();
  });

  it('should resolve token for user', async () => {
    const tokenString = 'tokenString';
    const token = ormGenerator.token();
    const spyResolve = jest
      .spyOn(tokenService, 'resolve')
      .mockImplementation(async () => token);
    await resolver.userConfirmEmail(tokenString);
    expect(spyResolve).toBeCalledWith(tokenString);
  });

  it('should fail resolving token for user due to non-existing token', async () => {
    const tokenString = 'tokenString';
    const spyResolve = jest
      .spyOn(tokenService, 'resolve')
      .mockImplementation(async () => undefined);
    await expect(resolver.userConfirmEmail(tokenString)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(spyResolve).toBeCalledWith(tokenString);
  });
});
