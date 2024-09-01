import { Controller, Post, Param, Delete, Req, HttpCode, HttpStatus, UseGuards, Get } from '@nestjs/common';
import { LikesService } from './likes.service';
import { AuthenticatedRequest } from 'src/auth/interfaces';
import { Like } from './entities/like.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  // like post
  @Post('posts/:postId/likes')
  async likePost(@Req() req: AuthenticatedRequest, @Param('postId') postId: string): Promise<Like> {
    return this.likesService.create({userId: req.user.id, postId: postId});
  }

  @Get('posts/:postId/likes')
  async getPostLikes(@Param('postId') postId: string): Promise<Like[]> {
    return this.likesService.findAll();
  }

  // unlike post
  @Delete('posts/:postId/likes')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unlikePost(@Req() req: AuthenticatedRequest, @Param('postId') postId: string): Promise<void> {
    return this.likesService.remove(req.user.id, postId);
  }
}
