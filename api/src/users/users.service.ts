import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AzureBlobService } from 'src/common/services/azure-blob.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly azureBlobService: AzureBlobService
  ) {}

  async create(createUserDto: CreateUserDto, file: Express.Multer.File): Promise<UserEntity> {
    const userExists = await this.usersRepository.existsBy({
      email: createUserDto.email,
    });
    if (userExists) throw new ConflictException('Email already exists');
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    const blobUrl = await this.azureBlobService.uploadFile(file.path, file.filename);
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      profilePictureUrl: blobUrl,

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

  async update(id: string, updateUserDto: UpdateUserDto, file: Express.Multer.File) {
    const user = await this.findOneById(id);
    Object.assign(user, updateUserDto);
    console.log('file.filename :>> ', file.filename);
    if (file) {
      const blobUrl = await this.azureBlobService.uploadFile(file.path, file.filename);
      user.profilePictureUrl = blobUrl;
    }
    return this.usersRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.findOneById(id);
    await this.usersRepository.remove(user);
  }
}
