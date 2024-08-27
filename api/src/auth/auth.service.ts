import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/interfaces';
import { Response } from 'express';
import { AuthToken, JwtPayload } from './interfaces';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOneByEmail(email);
    let isValid: boolean;
    if (user) {
      isValid = await bcrypt.compare(password, user.password);
    }
    if (isValid) {
      return user as User;
    }
    return null;
  }

  async login(user: User, res: Response) {
    const tokens = this.generateTokenPair(user);
    this.storeTokensInCookies(res, tokens);
    return {
      message: 'Login successful',
    };
  }

  async refreshToken(user: User, res: Response) {
    const tokens = this.generateTokenPair(user);
    this.storeTokensInCookies(res, tokens);
    return {
      message: 'Token refreshed',
    };
  }

  generateTokenPair(user: User): AuthToken {
    const payload: JwtPayload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload, {
      secret: jwtConstants.access_token_secret,
      expiresIn: '1m',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: jwtConstants.refresh_token_secret,
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  storeTokensInCookies(res: Response, authToken: AuthToken): void {
    res.cookie('access_token', authToken.accessToken, {
      maxAge: 1000 * 60 * 15,
      httpOnly: true,
    });
    res.cookie('refresh_token', authToken.refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
  }

  async logout(res: Response): Promise<{ message: string }> {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return {
      message: 'Logout successful',
    };
  }
}
