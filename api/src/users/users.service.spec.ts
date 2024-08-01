import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

const mockUserRepository = () => ({
  existsBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  findOneByEmail: jest.fn(),
  remove: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UsersService', () => {
  let service: UsersService;
  let repository: MockRepository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useFactory: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<MockRepository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
        bio: 'bio',
      };
      const user = new UserEntity({ ...createUserDto });

      repository.existsBy.mockResolvedValue(false);
      repository.create.mockReturnValue(user);
      repository.save.mockResolvedValue(user);

      const result = await service.create(createUserDto);

      expect(repository.existsBy).toHaveBeenCalledWith({
        email: createUserDto.email,
      });
      expect(result).toBeInstanceOf(UserEntity);
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          username: createUserDto.username,
          email: createUserDto.email,
          password: expect.any(String),
          bio: createUserDto.bio,
        }),
      );
      expect(repository.save).toHaveBeenCalledWith(user);
    });

    it('should throws if user already exists', async () => {
      const createUserDto = {
        username: 'existinguser',
        email: 'user@exists.com',
        password: 'password',
        bio: 'bio',
      };

      repository.existsBy.mockResolvedValue(true);

      const respPromise = service.create(createUserDto);
      expect(respPromise).rejects.toThrow('Email already exists');
      expect(respPromise).rejects.toBeInstanceOf(ConflictException);
      expect(repository.create).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('find all', () => {
    it('should return an array of users', async () => {
      const users = [
        new UserEntity({
          username: 'testuser1',
          email: 'user1@test.com',
        }),
        new UserEntity({
          username: 'testuser2',
          email: 'user2@test.com',
        }),
      ];
      repository.find.mockResolvedValue(users);
      const response = service.findAll();
      expect(response).resolves.toEqual(users);
    });
  });

  describe('findOneById', () => {
    it('should return a user if found', () => {
      const user = new UserEntity({
        id: '1',
        username: 'usertest',
        email: 'user@test.com',
      });
      repository.findOneBy.mockResolvedValue(user);
      const responsePromise = service.findOneById('1');
      expect(responsePromise).resolves.toBe(user);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: '1' });
    });

    it('should throw error if not found', () => {
      const id = '1';
      repository.findOneBy.mockResolvedValue(null);
      const responsePromise = service.findOneById(id);
      expect(responsePromise).rejects.toThrow(`User with id ${id} not found`);
      expect(responsePromise).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('update', () => {
    it('should return a user updated', () => {
      const updateUserDto = { username: 'updatedUser' };
      const user = new UserEntity({
        id: '1',
        username: 'usertest',
        email: 'user@test.com',
      });
      const updatedUser = { ...user, ...updateUserDto };
      repository.findOneBy.mockResolvedValue(user);
      repository.save.mockResolvedValue(updatedUser);
      const responsePromise = service.update('1', updateUserDto);
      expect(responsePromise).resolves.toBe(updatedUser);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: '1' });
    });

    it('should throw a not found exception if user is not found', async () => {
      const id = '1';
      repository.findOneBy.mockResolvedValue(null);

      const responsePromise = service.update(id, { username: 'updatedUser' });
      expect(responsePromise).rejects.toThrow(`User with id ${id} not found`);
      expect(responsePromise).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user if found', async () => {
      const id = '1';
      const user = new UserEntity({
        id: id,
        username: 'usertest',
        email: 'user@test.com',
      });
      repository.findOneBy.mockResolvedValue(user);
      repository.remove.mockResolvedValue(user);
      await service.remove('1');

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: id });
      expect(repository.remove).toHaveBeenCalledWith(user);
    });

    it('should throw a not found exception if user is not found', async () => {
      const id = '1';
      repository.findOneBy.mockResolvedValue(null);

      const responsePromise = service.remove(id);
      expect(responsePromise).rejects.toThrow(`User with id ${id} not found`);
      expect(responsePromise).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
