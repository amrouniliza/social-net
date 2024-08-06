import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/interfaces';
import { Response } from 'express';
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
    const token = this.jwtService.sign(payload);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return {
      message: 'Login successful',
    };
  }

  async logout(res: Response) {
    res.clearCookie('jwt');
    return {
      message: 'Logout successful',
    };
  }
}
