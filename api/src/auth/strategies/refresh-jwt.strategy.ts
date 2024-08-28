import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';
import { Request } from 'express';
import { JwtPayload, ValidatedUser } from '../interfaces';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshTokenStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.refresh_token_secret,
    });
  }

  async validate(payload: JwtPayload): Promise<ValidatedUser> {
    const user = await this.usersService.findOneById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return { id: payload.sub, email: payload.email };
  }

  private static extractJWT(req: Request): string | null {
    if (req.cookies && 'refreshToken' in req.cookies) {
      return req.cookies.refreshToken;
    }
    return null;
  }
}
