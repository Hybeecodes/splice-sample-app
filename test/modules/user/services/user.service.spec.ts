import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../../src/modules/user/services/user.service';
import { Components } from "../../../../src/shared/constants/enumerations";
import { MockUserRepository } from "../../../mocks/repositories/mock.user.repository";
import { PinoLogger } from "nestjs-pino";
import { IUserRepository } from "../../../../src/modules/user/interfaces/user.repository.interface";
import { getRecord } from "../../../mocks/fixtures/user.fixture";
import { UserDto } from "../../../../src/modules/user/dtos/user.dto";
import { NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "../../../../src/modules/user/dtos/create-user.dto";

describe('UserService', () => {
  let service: UserService;
  let logger: PinoLogger;
  let userRepository: IUserRepository
  const USER_SERVICE_PINO_LOGGER = 'PinoLogger:UserService';

  beforeEach(async () => {
    logger = {
      info: jest.fn(),
      error: jest.fn(),
    } as unknown as PinoLogger;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: Components.USER_REPOSITORY,
          useClass: MockUserRepository
        },
        { provide: USER_SERVICE_PINO_LOGGER, useValue: logger },
      ],
    }).compile();

    service = module.get<UserService>(UserService) as UserService;
    userRepository = module.get<IUserRepository>(
      Components.USER_REPOSITORY,
    ) as IUserRepository;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findUserByEmail', () => {
    let findByEmailSpy: jest.SpyInstance;

    beforeEach(() => {
      findByEmailSpy = jest.spyOn(userRepository, 'findByEmail');
    })
    it('should return a user if found', async () => {
      const email = 'test@example.com';
      const user = getRecord({email});
      findByEmailSpy.mockResolvedValue(user);
      const result = await service.findUserByEmail(email);
      expect(result).toEqual(new UserDto(user));
      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const email = 'test@example.com';
      findByEmailSpy.mockResolvedValue(null);
      await expect(service.findUserByEmail(email)).rejects.toThrowError(
        new NotFoundException(`User with email ${email} not found`),
      )
    });
  });

  describe('createUser', () => {
    let createUserSpy: jest.SpyInstance;

    beforeEach(() => {
      createUserSpy = jest.spyOn(userRepository, 'createUser');
    });

    it('should create a user', async () => {
      const data: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe',
      };
      const user = getRecord(data);
      createUserSpy.mockResolvedValue(user);
      const result = await service.createUser(data);
      expect(result).toEqual(new UserDto(user));
      expect(userRepository.createUser).toHaveBeenCalledWith(data);
    });
  });

  describe('updateUser', () => {
    let updateUserSpy: jest.SpyInstance;

    beforeEach(() => {
      updateUserSpy = jest.spyOn(userRepository, 'updateUser');
    });

    it('should update a user', async () => {
      const id = '1';
      const data: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe',
      };
      const user = getRecord(data);
      updateUserSpy.mockResolvedValue(user);
      const result = await service.updateUser(id, data);
      expect(result).toEqual(new UserDto(user));
      expect(userRepository.updateUser).toHaveBeenCalledWith(id, data);
    });
  });
});
