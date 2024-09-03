import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likesRepository: Repository<Like>,
    private readonly postService: PostsService
  ) {}
  async create(createLikeDto: CreateLikeDto) {
    const post = await this.postService.findOneById(createLikeDto.postId);
    const likeExists = await this.findOneByUserAndPost(createLikeDto.userId, createLikeDto.postId);
    if (likeExists) {
      throw new BadRequestException('You already liked this post');
    }
    const newLike = this.likesRepository.create({
      user: { id: createLikeDto.userId },
      post
    });
    return this.likesRepository.save(newLike);
  }

  findAll() {
    return this.likesRepository.find();
  }

  findOneByUserAndPost(userId: string, postId: string) {
    return this.likesRepository.findOne({
      where: {
        user: { id: userId },
        post: { id: postId }
      },
    });
  }

  async remove(userId: string, postId: string): Promise<void> {
    const like = await this.findOneByUserAndPost(userId, postId);
    await this.likesRepository.remove(like);
  }
}
