import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>,
  ) {}

  create(createPostDto: CreatePostDto): Promise<PostEntity> {
    const newPost = this.postsRepository.create(createPostDto);
    return this.postsRepository.save(newPost);
  }

  findAll(): Promise<PostEntity[]> {
    return this.postsRepository.find();
  }

  async findOneById(id: string): Promise<PostEntity> {
    const post = await this.postsRepository.findOneBy({ id });
    if (!post) throw new NotFoundException(`Post with id ${id} not found`);
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<PostEntity> {
    const post = await this.findOneById(id);
    Object.assign(post, updatePostDto);
    return this.postsRepository.save(post);
  }

  async remove(id: string): Promise<void> {
    const post = await this.findOneById(id);
    await this.postsRepository.remove(post);
  }
}
