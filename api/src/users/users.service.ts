import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AzureBlobService } from 'src/common/services/azure-blob.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly azureBlobService: AzureBlobService
  ) {}

  async create(createUserDto: CreateUserDto, file: Express.Multer.File): Promise<User> {
    const userExists = await this.usersRepository.existsBy({
      email: createUserDto.email,
    });
    if (userExists) throw new ConflictException('Email already exists');
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    // const blobUrl = await this.azureBlobService.uploadFile(file.path, file.filename);
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      // avatarUrl: blobUrl,

    });
    return this.usersRepository.save(newUser);
  }

  findAll() {
    return this.usersRepository.find();
  }

  async findOneById(id: string) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user)
      throw new NotFoundException(`User with email ${email} not found`);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto, avatar: Express.Multer.File, background: Express.Multer.File) {
    const user = await this.findOneById(id);
    Object.assign(user, updateUserDto);
    if (avatar) {
      const avatarBlobUrl = await this.azureBlobService.uploadFile(avatar.path, avatar.filename);
      user.avatarUrl = avatarBlobUrl;
    }
    if (background) {
      const backgroundBlobUrl = await this.azureBlobService.uploadFile(background.path, background.filename);
      user.backgroundUrl = backgroundBlobUrl;
    }
    return this.usersRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.findOneById(id);
    await this.usersRepository.remove(user);
  }
}
