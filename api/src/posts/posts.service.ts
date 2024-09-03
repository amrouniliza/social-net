import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import {
  PaginatedResource,
  Pagination,
} from 'src/common/decorators/pagination-params.decorator';
import { Sorting } from 'src/common/decorators/sorting-params.decorator';
import { Filtering } from 'src/common/decorators/filtering-params.decorator';
import { getOrder, getWhere } from 'src/common/helpers/typeorm.helpers';
import { AzureBlobService } from 'src/common/services/azure-blob.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    private readonly azureBlobService: AzureBlobService,
    private readonly usersService: UsersService
  ) {}

  async create(createPostDto: CreatePostDto, file: Express.Multer.File): Promise<Post> {

    const author = await this.usersService.findOneById(createPostDto.authorId);

    const blobUrl = await this.azureBlobService.uploadFile(file.path, file.filename);

    const newPost = this.postsRepository.create({
      ...createPostDto,
      author,
      imageUrl: blobUrl,
    });
    return this.postsRepository.save(newPost);
  }

  async findAll(
    { page, limit, size, offset }: Pagination,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<PaginatedResource<Post>> {
    const where = getWhere(filter);
    const order = getOrder(sort);

    const [posts, total] = await this.postsRepository.findAndCount({
      where,
      order,
      take: limit,
      skip: offset,
      relations: { author: true },
    });

    return {
      items: posts,
      totalItems: total,
      page,
      size,
    };
  }

  async findAllByAuthor(authorId: string): Promise<Post[]> {
    const posts = await this.postsRepository.find({
      where: { author: { id: authorId } },
      order: { createdAt: 'DESC' },
      relations: {
        author: true,
        likes: {
          user: true,
          post: true
        },
        comments: {
          author: true
        }
      },
    });
    if (posts.length === 0) {
      throw new NotFoundException(
        `No posts found for author with ID ${authorId}`,
      );
    }
    return posts;
  }

  async findOneById(id: string): Promise<Post> {
    const post = await this.postsRepository.findOneBy({ id });
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.findOneById(id);
    if (updatePostDto.authorId) {
      const author = await this.usersService.findOneById(updatePostDto.authorId);
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
