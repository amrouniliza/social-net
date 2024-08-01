import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { AuthenticatedRequest } from './interfaces';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Req() req: AuthenticatedRequest) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: AuthenticatedRequest) {
    return req.user;
  }
}
