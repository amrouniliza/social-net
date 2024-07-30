import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConflictException } from '@nestjs/common';

const userMock = new UserEntity({
  id: 'some uuid',
  username: 'john',
  email: 'john.doe@test.com',
  password: 'password',
  bio: 'bio',
  posts: [],
  comments: [],
  likes: [],
  friends: [],
  friendships: [],
  friendOf: [],
});

const userUpdatedMock = Object.assign(userMock, { username: 'Jane' });

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest
              .fn()
              .mockImplementation((createUserDto: CreateUserDto) =>
                Promise.resolve(userMock),
              ),
            findAll: jest.fn().mockResolvedValue([userMock]),
            findOneById: jest
              .fn()
              .mockImplementation((id: string) => Promise.resolve(userMock)),
            update: jest
              .fn()
              .mockImplementation((id: string, updateUserDto: UpdateUserDto) =>
                Promise.resolve(userUpdatedMock),
              ),
            remove: jest
              .fn()
              .mockImplementation((id: string) => Promise.resolve()),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create and return a new user', async () => {
    const newUser: CreateUserDto = {
      username: 'john',
      email: 'john.doe@test.com',
      password: 'password',
      bio: 'bio',
    };
    const createServiceSpy = jest.spyOn(service, 'create');
    const response = await controller.create(newUser);

    expect(response).toBe(userMock);
    expect(createServiceSpy).toHaveBeenCalledWith(newUser);
  });

  it('should throw a conflict exception if email is already taken', async () => {
    const createUserDto: CreateUserDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password',
      bio: 'bio',
    };

    jest.spyOn(service, 'create').mockImplementation(async () => {
      throw new ConflictException('Email already exists');
    });
    const respPromise = controller.create(createUserDto);
    expect(respPromise).rejects.toBeInstanceOf(ConflictException);
    expect(respPromise).rejects.toThrow('Email already exists');
  });

  it('should get an array of users', async () => {
    const response = await controller.findAll();

    expect(response).toEqual([userMock]);
  });

  it('should retrieve a user by id', async () => {
    const findByIdServiceSpy = jest.spyOn(service, 'findOneById');
    const response = await controller.findOneById(userMock.id);

    expect(response).toBe(userMock);
    expect(findByIdServiceSpy).toHaveBeenCalledWith(userMock.id);
  });

  it('should update user', async () => {
    const userUpdatedDto: UpdateUserDto = {
      username: 'Jane',
    };
    const updateServiceSpy = jest.spyOn(service, 'update');
    const response = await controller.update('some uuid', userUpdatedDto);

    expect(updateServiceSpy).toHaveBeenCalledWith('some uuid', userUpdatedDto);
    expect(response).toBe(userUpdatedMock);
  });

  it('should remove a user', async () => {
    const removeServiceSpy = jest.spyOn(service, 'remove');
    const response = await controller.remove(userMock.id);

    expect(removeServiceSpy).toHaveBeenCalledWith(userMock.id);
    expect(response).toBeUndefined();
  });
});
