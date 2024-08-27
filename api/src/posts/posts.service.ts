import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  PaginatedResource,
  Pagination,
} from 'src/common/decorators/pagination-params.decorator';
import { Sorting } from 'src/common/decorators/sorting-params.decorator';
import { Filtering } from 'src/common/decorators/filtering-params.decorator';
import { getOrder, getWhere } from 'src/common/helpers/typeorm.helpers';

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

  async findAll(
    { page, limit, size, offset }: Pagination,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<PaginatedResource<PostEntity>> {
    const where = getWhere(filter);
    const order = getOrder(sort);

    const [posts, total] = await this.postsRepository.findAndCount({
      where,
      order,
      take: limit,
      skip: offset,
    });

    return {
      items: posts,
      totalItems: total,
      page,
      size,
    };
  }

  async findAllByAuthor(authorId: string): Promise<PostEntity[]> {
    const posts = await this.postsRepository.find({
      where: { author: { id: authorId } },
      relations: { author: true },
    });
    if (posts.length === 0) {
      throw new NotFoundException(
        `No posts found for author with ID ${authorId}`,
      );
    }
    return posts;
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
