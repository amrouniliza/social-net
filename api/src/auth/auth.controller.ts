import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Req,
  Get,
  Body,
  Res,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { AuthenticatedRequest } from './interfaces';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { Response } from 'express';
import { RefreshJwtAuthGuard } from './guards/refresh-jwt-auth.guard';
import { ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SignInDto } from './dto/signin.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ type: AuthResponseDto })
  @ApiConflictResponse()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  register(
    @Body() user: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    return this.authService.register(user, res);
  }

  @ApiBody({ type: SignInDto })
  @ApiOkResponse({ type: AuthResponseDto })
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(req.user, res);
  }

  @ApiOkResponse({ type: AuthResponseDto })
  @UseGuards(RefreshJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('refresh')
  async refresh(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    return this.authService.refreshToken(req.user, res);
  }

  @ApiOkResponse({ type: AuthResponseDto })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserEntity })
  @Get('me')
  getProfile(@Req() req: AuthenticatedRequest) {
    return this.usersService.findOneById(req.user.id);
  }
}
