import { Injectable } from '@nestjs/common';
import { Comment } from './entities/comment.entity';
import { PostsService } from 'src/posts/posts.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly postsService: PostsService
  ) {}
  async create(author: User, postId: string, content: string): Promise<Comment> {
    const post = await this.postsService.findOneById(postId);

    const newComment = this.commentRepository.create({
      content,
      author,
      post
    });
    return this.commentRepository.save(newComment);
  }

  remove(commentId: string) {
    return this.commentRepository.delete(commentId)
  }
}
