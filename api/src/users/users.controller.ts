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
  UploadedFiles,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
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

  @UseInterceptors(FileFieldsInterceptor([
    { name: 'avatar', maxCount: 1 },
    { name: 'background', maxCount: 1 },
  ], multerConfig))
  // @UseInterceptors(FileInterceptor('avatar', multerConfig))
  // @UseInterceptors(FileInterceptor('background', multerConfig))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    // @UploadedFile() avatar: Express.Multer.File,
    // @UploadedFile() background: Express.Multer.File,
    @UploadedFiles() files: { avatar?: Express.Multer.File[], background?: Express.Multer.File[] }
  ): Promise<UserEntity> {
    return this.usersService.update(id, updateUserDto, files.avatar[0], files.background[0]);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
