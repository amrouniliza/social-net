import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthenticatedRequest } from './interfaces';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: Partial<AuthService>;

  beforeEach(async () => {
    authService = {
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const req = {
        user: { id: '1', email: 'example@test.com' },
      } as AuthenticatedRequest;
      const result = { access_token: 'signed-jwt-token' };
      (authService.login as jest.Mock).mockResolvedValue(result);

      expect(await controller.login(req)).toBe(result);
    });
  });

  describe('getProfile', () => {
    it('should return the user profile', () => {
      const req = {
        user: { id: '1', email: 'example@test.com' },
      } as AuthenticatedRequest;

      expect(controller.getProfile(req)).toBe(req.user);
    });
  });
});
