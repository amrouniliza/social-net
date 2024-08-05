import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/interfaces';
import { UserEntity } from 'src/users/entities/user.entity';
import { JwtPayload } from './interfaces';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    usersService = {
      findOneByEmail: jest.fn(),
    };
    jwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data if validation is successful', async () => {
      const user = {
        id: '1',
        email: 'example@test.com',
        password: await bcrypt.hash('test', 10),
      } as UserEntity;
      (usersService.findOneByEmail as jest.Mock).mockResolvedValue(user);

      const result = await service.validateUser('example@test.com', 'test');
      expect(result).toEqual(user);
    });

    it('should return null if validation fails', async () => {
      (usersService.findOneByEmail as jest.Mock).mockResolvedValue(null);

      const result = await service.validateUser(
        'example@test.com',
        'wrongpassword',
      );
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token', async () => {
      const user = { id: '1', email: 'example@test.com' } as User;
      const payload: JwtPayload = { email: 'example@test.com', sub: '1' };
      (jwtService.sign as jest.Mock).mockReturnValue('signed-jwt-token');

      const result = await service.login(user);
      expect(result).toEqual({ accessToken: 'signed-jwt-token' });
      expect(jwtService.sign).toHaveBeenCalledWith(payload);
    });
  });
});
