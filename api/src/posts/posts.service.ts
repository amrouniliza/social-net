import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<PostEntity> {
    const author = await this.usersRepository.findOneBy({
      id: createPostDto.authorId,
    });
    if (!author) {
      throw new NotFoundException('Author not found');
    }

    const newPost = this.postsRepository.create({
      ...createPostDto,
      author,
    });
    return this.postsRepository.save(newPost);
  }

  findAll(): Promise<PostEntity[]> {
    return this.postsRepository.find();
  }

  async findOneById(id: string): Promise<PostEntity> {
    const post = await this.postsRepository.findOneBy({ id });
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<PostEntity> {
    const post = await this.findOneById(id);
    if (updatePostDto.authorId) {
      const author = await this.usersRepository.findOneBy({
        id: updatePostDto.authorId,
      });
      if (!author) {
        throw new NotFoundException('Author not found');
      }
      updatePostDto.authorId = author.id;
    }
    Object.assign(post, updatePostDto);
    return this.postsRepository.save(post);
  }

  async remove(id: string): Promise<void> {
    const post = await this.findOneById(id);
    await this.postsRepository.remove(post);
  }
}
