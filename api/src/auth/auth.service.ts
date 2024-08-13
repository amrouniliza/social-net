import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/interfaces';
import { Request, Response } from 'express';
import { JwtPayload } from './interfaces';

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
    const payload: JwtPayload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return {
      message: 'Login successful',
      user: user,
    };
  }

  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      const payload = this.jwtService.verify(refreshToken);
      const newAccessToken = this.jwtService.sign(
        { email: payload.email, sub: payload.sub },
        { expiresIn: '15m' },
      );

      res.cookie('jwt', newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });
      return {
        message: 'Token refreshed',
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(res: Response) {
    res.clearCookie('jwt');
    return {
      message: 'Logout successful',
    };
  }
}
