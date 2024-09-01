import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { AuthToken, JwtPayload } from './interfaces';
import { jwtConstants } from './constants';
import { AuthResponseDto } from './dto/auth-response.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AzureBlobService } from 'src/common/services/azure-blob.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private azureBlobService: AzureBlobService
  ) {}


  /**
   * Validates a user by checking the given email and password against the
   * stored data in the database.
   *
   * @param email The email of the user to validate
   * @param password The password of the user to validate
   *
   * @returns The user if the validation is successful, or null if it isn't
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOneByEmail(email);
    return user && (await bcrypt.compare(password, user.password))
      ? user
      : null;
  }

  async register(user: CreateUserDto, file: Express.Multer.File, res: Response): Promise<AuthResponseDto> {
    const createdUser = await this.usersService.create(user, file);
    const tokens = this.generateTokenPair(createdUser);
    this.storeTokensInCookies(res, tokens);
    return new AuthResponseDto('Registration successful');
  }


  /**
   * Logs in a user and stores the JWT tokens in cookies.
   *
   * @param user The user to log in.
   * @param res The response object to store the JWT tokens in cookies.
   * @returns An AuthResponseDto with a success message.
   */
  async login(user: User, res: Response): Promise<AuthResponseDto> {
    const tokens = this.generateTokenPair(user);
    this.storeTokensInCookies(res, tokens);
    return new AuthResponseDto('Login successful');
  }


  /**
   * Refreshes the user's JWT tokens and stores them in cookies.
   *
   * @param user The user whose tokens to refresh.
   * @param res The response object to store the JWT tokens in cookies.
   * @returns An AuthResponseDto with a success message.
   */
  async refreshToken(user: User, res: Response): Promise<AuthResponseDto> {
    const tokens = this.generateTokenPair(user);
    this.storeTokensInCookies(res, tokens);
    return new AuthResponseDto('Refresh token successful');
  }

  
  /**
   * Logs out the user by clearing the JWT tokens stored in cookies.
   *
   * @param res The response object to clear the JWT tokens in cookies.
   * @returns An AuthResponseDto with a success message.
   */
  async logout(res: Response): Promise<AuthResponseDto> {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return new AuthResponseDto('Logout successful');
  }


  /**
   * Stores the given JWT tokens in cookies.
   *
   * @param res The response object to store the JWT tokens in cookies.
   * @param authToken The object containing the access and refresh tokens to store.
   */
  private storeTokensInCookies(res: Response, authToken: AuthToken): void {
    res.cookie('accessToken', authToken.accessToken, {
      maxAge: 1000 * 60 * 15,
      httpOnly: true,
    });
    res.cookie('refreshToken', authToken.refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
  }


  /**
   * Generates a pair of JWT access and refresh tokens for the given user.
   * 
   * @param user The user to generate the JWT tokens for.
   * @returns An object containing the access token and refresh token.
   */
  private generateTokenPair(user: User): AuthToken {
    const payload: JwtPayload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload, {
      secret: jwtConstants.access_token_secret,
      expiresIn: '1d',
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
}
