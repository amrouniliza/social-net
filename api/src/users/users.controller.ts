import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/common/configs/multer.config';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseInterceptors(FileInterceptor('file', multerConfig))
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @UploadedFile() file: Express.Multer.File): Promise<UserEntity> {
    return this.usersService.create(createUserDto, file);
  }

  @Get()
  async findAll(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOneById(@Param('id') id: string): Promise<UserEntity> {
    return this.usersService.findOneById(id);
  }

  @UseInterceptors(FileInterceptor('file', multerConfig))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UserEntity> {
    return this.usersService.update(id, updateUserDto, file);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
