import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';
import {
  PaginatedResource,
  Pagination,
  PaginationParams,
} from 'src/common/decorators/pagination-params.decorator';
import {
  Sorting,
  SortingParams,
} from 'src/common/decorators/sorting-params.decorator';
import {
  Filtering,
  FilteringParams,
} from 'src/common/decorators/filtering-params.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/common/configs/multer.config';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file', multerConfig))

  async create(@Body() createPostDto: CreatePostDto, @UploadedFile() file: Express.Multer.File): Promise<PostEntity> {
    return this.postsService.create(createPostDto, file);
  }

  @Get()
  async findAll(
    @PaginationParams() paginationParams: Pagination,
    @SortingParams(['createdAt']) sort?: Sorting,
    @FilteringParams([]) filter?: Filtering,
  ): Promise<PaginatedResource<PostEntity>> {
    return this.postsService.findAll(paginationParams, sort, filter);
  }

  @Get(':id')
  async findOneById(@Param('id') id: string): Promise<PostEntity> {
    const post = await this.postsService.findOneById(id);
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return post;
  }

  @Get('author/:authorId')
  async findAllByAuthor(
    @Param('authorId') authorId: string,
  ): Promise<PostEntity[]> {
    return this.postsService.findAllByAuthor(authorId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostEntity> {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.postsService.remove(id);
  }
}
