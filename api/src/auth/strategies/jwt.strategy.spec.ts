import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtPayload, ValidatedUser } from '../interfaces';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let usersService: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: getRepositoryToken(User), useClass: Repository },
        {
          provide: UsersService,
          useValue: {
            findOneById: jest.fn(),
          },
        },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(
      getRepositoryToken(User),
    );
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  describe('validate', () => {
    it('should validate and return the user if found', async () => {
      const payload: JwtPayload = {
        sub: '1',
        email: 'test@example.com',
        iat: 1,
        exp: 2,
      };
      const user = new User({ id: '1', email: 'test@example.com' });
      const validatedUser: ValidatedUser = {
        id: '1',
        email: 'test@example.com',
      };

      jest.spyOn(usersService, 'findOneById').mockResolvedValue(user);

      const result = await jwtStrategy.validate(payload);

      expect(result).toStrictEqual(validatedUser);
    });

    it('should throw an UnauthorizedException if user not found', async () => {
      const payload: JwtPayload = {
        sub: '1',
        email: 'test@example.com',
        iat: 1,
        exp: 2,
      };

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      await expect(jwtStrategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
